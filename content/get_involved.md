---
title: "How to get involved?"
desc: "If you are missing a feature in the convention, something is unclear and requires better documentation or you have a better solution for a current feature: Get Involved!"
---

{{< card arrow="true" title="Propose feature" footerclass="text-right" buttons="<a href='https://github.com/homieiot/convention/issues' class='btn btn-primary'>Raise an Issue</a> <a href='https://github.com/homieiot/convention/pulls' class='btn btn-primary'>Open a Pull-Request</a>" >}}
Open a new GitHub Issue to start a discussion about a new feature.
Open a GitHub Pull Request to provide a change to the convention and have it discussed.
{{< /card >}}

{{< card arrow="true" title="Feedback" >}}
The discussion period for a new feature lasts for a maximum of 3 weeks. Everyone involved can apply for a longer time frame if required. 3 weeks no progress means "Rejected" automatically.

Active maintainers are required to response within 3 weeks to a feature request.
{{< /card >}}

{{< cardfooter arrow="true" title="Consensus" footerclass="text-muted small"
text="All active maintainers MUST agree on a new feature for it to be added.<br>An exception is the trivial case (spelling error, ...) in which a single maintainer is sufficient." >}}
Active maintainers: {{< maintainers >}}
{{< /cardfooter >}}

{{< card title="Merge feature" >}}
A new feature or specification change must be categorized and the commit message must be prefixed with:

* BREAKING: The commit message for breaking commits (MAJOR bumped)
* feature: The commit message for new features commits (MINOR bumped)
* fix: The commit message for fixes (PATCH bumped)
{{< /card >}}
