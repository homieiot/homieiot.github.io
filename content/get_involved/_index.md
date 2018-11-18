# How to get involved?

<div class="card my-4">
<div class="card-header">
    Propose feature
  </div>
  <div class="card-body">
  <p class="card-text">
  If you are missing a feature in the convention, something is unclear and requires better documentation or you have a better solution for a current feature: Get Involved!
  </p>
    <p class="card-text">Open a new GitHub Issue to start a discussion about a new feature.
Open a GitHub Pull Request to provide a change to the convention and have it discussed.</p>
    <a href="https://github.com/homieiot/convention/issues" class="btn btn-primary">Raise an Issue</a>
    <a href="https://github.com/homieiot/convention/pulls" class="btn btn-primary">Open a Pull-Request</a>
  </div>
</div>

<center style="font-size:3em;"><i class="fas fa-arrow-down"></i></center>

<div class="card mb-4">
<div class="card-header">
    Feedback
  </div>
  <div class="card-body">
    <p class="card-text">The discussion period for a new feature lasts for a maximum of 3 weeks. Everyone involved can apply for a longer time frame if required. 3 weeks no progress means "Rejected" automatically.</p>
    <p class="card-text">Active maintainers are required to response within 3 weeks to a feature request.</p>
  </div>
</div>

<center style="font-size:3em;"><i class="fas fa-arrow-down"></i></center>

<div class="card mb-4">
<div class="card-header">
    Consensus
  </div>
  <div class="card-body">
    <p class="card-text">All active maintainers MUST agree on a new feature for it to be added.</p>
    <p class="card-text">An exception is the trivial case (spelling error, ...) in which a single maintainer is sufficient.</p>
  </div>
    <div class="card-footer">
      <small class="text-muted" title="A maintainer can remove/add himself at any time if workload/holiday will prevent him participating in a foreseeable future">
      Active maintainers: {{< maintainers >}}
      </small>
    </div>
</div>

<center style="font-size:3em;"><i class="fas fa-arrow-down"></i></center>

<div class="card mb-4">
<div class="card-header">
    Merge feature
  </div>
  <div class="card-body">
    <p class="card-text">A new feature or specification change must be categorized and the commit message must be prefixed with:</p>
    <ul>
    <li>BREAKING: The commit message for breaking commits (MAJOR bumped)
    <li>feature: The commit message for new features commits (MINOR bumped)
    <li>fix: The commit message for fixes (PATCH bumped)
    </ul>
  </div>
</div>
