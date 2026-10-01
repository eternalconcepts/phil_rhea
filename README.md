# Astro Starter Kit: Basics

```sh
npm create astro@latest -- --template basics
```

!@ DL !! !!
[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/withastro/astro/tree/latest/examples/basics)
[![Open with CodeSandbox](https://assets.codesandbox.io/github/button-edit-lime.svg)](https://codesandbox.io/p/sandbox/github/withastro/astro/tree/latest/examples/basics)
[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/withastro/astro?devcontainer_path=.devcontainer/basics/devcontainer.json)

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

![just-the-basics](https://github.com/withastro/astro/assets/2244813/a0a5533c-a856-4198-8470-2d67b1d7c554)

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/

├── public/
│   └── favicon.svg
├── src/
│   ├── layouts/
│   │   └── Layout.astro
│   └── pages/
│       └── index.astro
└── package.json
```

To learn more about the folder structure of an Astro project, refer to [our guide on project structure](https://docs.astro.build/en/basics/project-structure/).

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## Contact Form Spam Protection

Both contact forms include a text input named `_cp`. Tailwind's `sr-only`
utility visually hides it while keeping it in the HTML. It is excluded from
keyboard navigation and assistive technology and has autocomplete disabled.
Visitors should leave it empty.

The send button starts disabled. It becomes enabled when all required fields
are valid and `_cp` is empty. It stays disabled while sending, becomes disabled
if `_cp` is filled (including whitespace), and is disabled again after a
successful form reset. Autofill and value changes without input events are
also checked while the form is visible.

The `/api/contact` endpoint rejects filled, missing, duplicate, or non-text
honeypot values before contacting Gmail. It also validates required fields and
input lengths. Successful submissions reset the form and display the green
confirmation; unsuccessful submissions preserve the entered fields.

No CAPTCHA account or keys are needed. Use the existing Gmail environment
variables listed in `.env.example`, and deploy the updated form and API together.

Run `npm run test:contact` to check the server behavior with mocked SMTP.
These tests do not send email or require credentials.

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
