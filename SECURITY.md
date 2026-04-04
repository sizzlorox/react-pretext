# Security Policy

## Supported versions

| Version | Supported |
|---------|-----------|
| Latest  | Yes       |

Only the latest published version on npm receives security fixes.

## Reporting a vulnerability

**Do not open a public GitHub issue for security vulnerabilities.**

Please report security issues by emailing the maintainer directly (see the [npm package page](https://www.npmjs.com/package/@sizzlorox/react-pretext) for contact details) or by using [GitHub's private vulnerability reporting](https://github.com/sizzlorox/react-pretext/security/advisories/new).

Include:

- A description of the vulnerability and its potential impact
- Steps to reproduce or a minimal proof of concept
- Any suggested remediation if you have one

You can expect an acknowledgement within 72 hours and a resolution or status update within 14 days.

## Scope

`react-pretext` is a client-side React library with no network requests, no server-side execution, and no persistence layer. The attack surface is limited to:

- Incorrect text layout results affecting UI rendering
- Dependency vulnerabilities in `@chenglou/pretext` (report those upstream)

If you are unsure whether an issue qualifies as a security vulnerability, report it privately and we will triage it together.
