#!/usr/bin/env python3
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
import os
import shutil
import difflib
from git import Repo,Git

def readyaml():
    with open("multiversion.yml", 'r') as stream:
        try:
            content = yaml.load(stream, Loader=yaml.CLoader)
            return content
        except yaml.YAMLError as exc:
            print(exc)
            exit(-1)

# Create a destination filename, given the repo name ("core","ota" etc),
# and the tag name ("master","v2.0").
def dest_filepath(reponame, refname):
    reponame = reponame.replace(" ","-").lower()
    return "spec-"+reponame+"-"+refname.replace(".","_")

# Copy files to "docs/". Filter sections of file first. Add generated header to file.
def write_file(reponame, targetdir, filename, data, tagname, date):
    # Generate version select box html code
    # Hide page in the left nav panel if not the latest
    header = "---\n"
    header += "source: "+filename+"\n"
    header += "version: "+tagname+"\n"
    header += "releasedate: "+date.strftime("%d. %B %Y")+"\n"
    header += "convention: "+reponame+"\n"
    header += "layout: specification\n"
    header += "---\n"

    # New file content and filename
    filecontent = header + "\n" + data
    filepath = os.path.join(targetdir,dest_filepath(reponame, tagname)+".md")
    
    with open(filepath, "w") as text_file:
        text_file.write(filecontent)
    print("Wrote file: "+filepath)

def write_diff_file(targetdir,reponame,ref,nextref):
    outputfilename = dest_filepath(reponame, nextref.name)+"-diff.html"
    header = "---\n"
    header += "convention: "+reponame+"\n"
    header += "oldfile: "+dest_filepath(reponame, ref.name)+".md\n"
    header += "newfile: "+dest_filepath(reponame, nextref.name)+".md\n"
    header += "oldversion: "+ref.name+"\n"
    header += "newversion: "+nextref.name+"\n"
    header += "diff: true\n"
    header += "type: page\n"
    header += "layout: diff\n"
    header += "---\n"
    with open(os.path.join(targetdir,dest_filepath(reponame, ref.name)+".md"), 'r') as firstfile:
        with open(os.path.join(targetdir,dest_filepath(reponame, nextref.name)+".md"), 'r') as secondfile:
            diff = difflib.HtmlDiff().make_table(firstfile.read().split("\n"),secondfile.read().split("\n"),ref.name,nextref.name,True,0)
            with open(os.path.join(targetdir,outputfilename), "w") as outputfile:
                outputfile.write(header+diff.replace("nowrap=\"nowrap\"","").replace("&nbsp;"," "))
                print("Wrote file: "+os.path.join(targetdir,outputfilename))

# Clone a repository url (or update repo), checkout all tags.
# Call copy_files for each checked out working directory
def checkout_repo(targetdir, reponame, repourl, checkoutdir, update_repos):
    localpath = os.path.join(checkoutdir,reponame)
    if os.path.exists(localpath):
        repo = Repo(localpath)
        if update_repos:
            print("Updating "+reponame)
            repo.remotes.origin.fetch()
    else:
        print("Clone "+reponame+" to "+localpath)
        repo = Repo.clone_from(repourl, localpath)

    if not os.path.exists(targetdir):
        os.makedirs(targetdir)

    # Add "develop" and all tags
    refs = []
    refs.append(repo.heads.develop)
    refs.extend(repo.tags)

    # Get all preface sections from the latest develop version
    repo.head.reference = repo.heads.develop
    repo.head.reset(index=True, working_tree=True)

    g = Git(localpath)
    # Combine all files of a repo and create one specificaton file out of it
    for ref in refs:
        repo.head.reference = ref
        repo.head.reset(index=True, working_tree=True)
        mainfile = "README.md"
        if os.path.exists(os.path.join(localpath,"convention.md")):
            mainfile = "convention.md"
        with open(os.path.join(localpath,mainfile), 'r') as myfile:
            data = myfile.read() + "\n"
        # Remove everything before the first minor heading to avoid headers and (on the website) broken images
        data = data[data.find('##'):]
        # Add an artificial level 1 heading to fix numbering of topics
        data = "#\n\n" + data
        tagname = ref.name
        date = ref.commit.committed_datetime
        absurl = repourl.replace(".git","")+"/tree/"+ref.name
        write_file(reponame, targetdir, mainfile, data, tagname, date)
    
    shutil.copyfile(os.path.join(targetdir,dest_filepath(reponame, "develop")+".md"), os.path.join(targetdir,"_index.md"))

    refs = []
    refs.extend(repo.tags)
    refs.append(repo.heads.develop)

    for ref, nextref in zip(refs[:-1], refs[1:]):
        write_diff_file(targetdir,reponame,ref, nextref)
        hexshas = g.log("--pretty=format:|%s|%ai|%h|", ref.name+".."+nextref.name).split('\n')
        changefilename = dest_filepath(reponame, nextref.name)+"-changes.md"
        with open(os.path.join(targetdir,changefilename), "w") as outputfile:
            header = "---\n"
            header += "convention: "+reponame+"\n"
            header += "oldfile: "+dest_filepath(reponame, ref.name)+".md\n"
            header += "newfile: "+dest_filepath(reponame, nextref.name)+".md\n"
            header += "oldversion: "+ref.name+"\n"
            header += "newversion: "+nextref.name+"\n"
            header += "changes: true\n"
            header += "---\n| Commit title | Date | Hash |\n|---|---|---|\n"
            outputfile.write(header+"\n".join(hexshas))
            print("Wrote file: "+os.path.join(targetdir,changefilename))


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
targetdir = os.path.abspath("content/specification")
update_repos = "updaterepos" in controlfile and controlfile["updaterepos"]
if os.path.exists(targetdir):
    shutil.rmtree(targetdir)
    os.makedirs(targetdir)
for entry in controlfile['specifications']:
    if not 'disabled' in entry or not entry['disabled']:
        checkout_repo(targetdir, entry['name'], entry['repo'], checkoutdir, update_repos)
