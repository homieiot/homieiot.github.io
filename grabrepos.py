#!/usr/bin/env python
# -*- coding: utf-8 -*-

# This python script will clone all repos defined in "multiversion.yml".
# It checks out all version tags (starting with "v") and grab all files matching
# the given file pattern. The files are prefixed with the version and added
# to the docs directory.
#
# A version switcher html code is generated and prepended to all copied files.
#
# License: Public domain
# Author: David Graeff <david.graeff@web.de>

import yaml
import io
import os
import re
import fnmatch
import shutil
from git import Repo

def readyaml():
    with open("multiversion.yml", 'r') as stream:
        try:
            content = yaml.load(stream)
            return content
        except yaml.YAMLError as exc:
            print(exc)
            exit(-1)

# Split a markdown content by its 2nd level headings and return the array
def split_by_headings(data):
    sections = []
    index = 0
    while True:
        index = data.find("\n## ", index)
        if index == -1:
            break
        nextindex = data.find("\n## ", index+1)
        if nextindex == -1:
            sections.append(data[index:])
            break
        else:
            sections.append(data[index:nextindex])
        index = nextindex
    return sections
        
# Filter the given array with markdown 2nd level headings.
# Keep everything that is mentioned in "keepsections".
def filter_by_headings(sections, keepsections):
    newsections = []
    if len(keepsections)==0: return newsections
    for section in sections:
        for keep in keepsections:
            if section.startswith("\n## "+keep):
                newsections.append(section.strip())
    return newsections

# Create a destination filename, given the repo name ("core","ota" etc),
# and the tag name ("master","v2.0").
def dest_filepath(reponame, refname):
    reponame = reponame.replace(" ","-").lower()
    return "spec-"+reponame+"-"+refname.replace(".","_")

# Copy files to "docs/". Filter sections of file first. Add generated header to file.
def write_file(reponame, targetdir, srcdir, keepsections, repotag, versions):
    sections = split_by_headings(repotag['data'])
    sections = filter_by_headings(sections, keepsections)

    if len(sections)<=0:
        return

    # Generate version select box html code
    # Hide page in the left nav panel if not the latest
    header = "---\n"
    if not repotag['latest']: header += "hidden: true\n"
    header += "path: "+repotag['absurl']+"\n"
    header += "source: "+repotag['filename']+"\n"
    header += "versioned:\n"+yaml.dump(versions)+"\n"
    header += "---\n# "+reponame+" Specification ("+repotag['name']+")\n"

    # New file content and filename
    filecontent = header + "\n".join(sections)
    filepath = os.path.join(targetdir,dest_filepath(reponame, repotag['name'])+".md")
    
    with open(filepath, "w") as text_file:
        text_file.write(filecontent)
    print("Wrote file: "+filepath)

# Clone a repository url (or update repo), checkout all tags.
# Call copy_files for each checked out working directory
def checkout_repo(name, repourl, filepattern, checkoutdir, keepsections, update_repos):
    localpath = os.path.join(checkoutdir,name)
    if os.path.exists(localpath):
        repo = Repo(localpath)
        if update_repos:
            print("Updating "+name)
            repo.remotes.origin.fetch()
    else:
        print("Clone "+name+" to "+localpath)
        repo = Repo.clone_from(repourl, localpath)

    refs = repo.tags
    refs = reversed(refs)

    repotags = []
    targetdir = os.path.abspath("docs")

    latest = True
    for ref in refs:
        repo.head.reference = ref
        repo.head.reset(index=True, working_tree=True)
        data = ""
        mainfile = ""
        for filename in fnmatch.filter(os.listdir(localpath), filepattern):
            filepath = os.path.join(localpath,filename)
            with open(filepath, 'r') as myfile:
                localdata = myfile.read() + "\n"
                sections = split_by_headings(localdata)
                sections = filter_by_headings(sections, keepsections)
                if len(sections)<=0:
                    continue
                data += localdata
                mainfile = filename
        tagname = ref.name
        repotags.append({
            "filename": mainfile,
            "data": data,
            "name": tagname,
            "date": ref.commit.committed_datetime,
            "absurl": repourl.replace(".git","")+"/tree/"+ref.name,
            "latest": latest
            })
        if latest:
            latest = False

    # Generate list of versions
    versions = []
    for repotag in repotags:
        versions.append({
            "url":"/"+dest_filepath(name, repotag['name']),
            "name": repotag['name'],
            "date": repotag['date'].strftime("%d. %B %Y")})

    for repotag in repotags:
        write_file(name, targetdir, localpath, keepsections, repotag, versions)

def recreate_dir(file_path, clean):
    directory = os.path.abspath(file_path)
    if clean and os.path.exists(directory):
        shutil.rmtree(directory)
    if not os.path.exists(directory):
        os.makedirs(directory)
    return directory

# Main program
controlfile = readyaml()
checkoutdir = recreate_dir("temp", "clean" in controlfile and controlfile["clean"])
update_repos = "updaterepos" in controlfile and controlfile["updaterepos"]
for entry in controlfile['specifications']:
    if not 'disabled' in entry or not entry['disabled']:
        checkout_repo(entry['name'], entry['repo'], entry['filepattern'],checkoutdir, entry['keepsections'], update_repos)
