# AI/Codex-Assisted Development Workflow

## Introduction

AI/Codex was used as a development assistant during AccessAdapt implementation. It supported frontend planning, profile data organisation, storage integration, debugging, testing guidance, and documentation preparation. Developers remained responsible for the final product.

## Development workflow

The workflow combined clearly scoped tasks, project-context review, generated suggestions, manual code integration, browser/build validation, and developer review. AI output was treated as a draft or technical aid rather than an authoritative source.

## Frontend, profile, and Settings assistance

AI/Codex assistance was used to explore React component structure, improve UI consistency, organise profile configuration data, and reason about Settings-page state updates. Suggestions were reviewed before incorporation into the project.

## Storage and debugging assistance

AI/Codex helped reason about `chrome.storage.local` state shape, default values, profile persistence, and safe fallback behaviour. It also assisted in diagnosing build and popup-loading issues by inspecting entry files, manifest configuration, and bundled output.

## Documentation and testing assistance

AI/Codex supported the preparation of technical documentation, user documentation, and structured frontend test cases. Developers reviewed the documents for responsibility boundaries, accuracy, and suitability for final submission.

## Human validation

- AI suggestions were reviewed by the developer and team.
- Generated code was modified where necessary.
- Code was integrated into the project manually.
- Functionality was tested and validated through the project workflow.
- Developers retained responsibility for design decisions, testing, integration, and final acceptance.

## What AI was useful for

- Breaking a module into manageable files and responsibilities
- Explaining browser-extension and React patterns
- Identifying likely causes of build or UI problems
- Drafting test cases and documentation structure
- Improving clarity and consistency in technical writing

## Limitations and prompt improvement

AI does not know a project's exact runtime state unless the relevant code, error messages, and requirements are provided. Outputs can be incomplete or unsuitable for a particular architecture. Prompts were improved by stating the affected files, responsibility boundaries, expected behaviour, constraints, and validation requirements.

## Responsible use of AI

AI/Codex was not treated as an authoritative source or a replacement for software-engineering judgement. No generated suggestion was accepted without human review. The development team remained accountable for privacy, accessibility, correctness, academic integrity, and final project decisions.

## Conclusion

Used responsibly, AI/Codex accelerated routine development and documentation work while preserving human ownership of the AccessAdapt implementation and its final quality.
