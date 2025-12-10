# Dione: Explore, Install, Innovate — in 1 Click

**Dione** makes installing complex applications as simple as clicking a button — no terminal or technical knowledge needed.

For developers, Dione offers a zero-friction way to distribute apps using just a JSON file.

**It has never been easier to install AI on your computer**

## Showcase

![Demo](https://i.imgur.com/wC8MF9C.png)

## Download

Download the latest release for your platform from [our website](https://getdione.app/download).

## Documentation

**Want to create and distribute apps with Dione?** Refer to the [developer documentation](https://docs.getdione.app/developer-guide/creating-a-dione-script) for comprehensive instructions on writing Dione scripts and app packaging.

## Contributing

If you're interested in contributing or running Dione locally, follow these steps:

### Prerequisites

* [Node.js](https://nodejs.org/en/download/)
* [pnpm](https://pnpm.io/installation)

### Run Locally

```bash
# Clone the repo
git clone https://github.com/dioneapp/dioneapp.git
cd dioneapp

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

> **Yes, it really is this easy.** Despite how powerful Dione is, the development setup is genuinely this simple. Please note that some functions requiring database calls may have limitations in local development.

### Production Build

Set `platform` as one of: win, mac, linux

```bash
pnpm build:[platform]
```

## Support & Contact

* For questions or feedback, join our [Discord community](https://getdione.app/discord).
* Security issues can be reported to [support@getdione.app](mailto:support@getdione.app).
