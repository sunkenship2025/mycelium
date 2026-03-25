export type SeedConfig = {
  id: string;
  name: string;
  publisher: string;
  license: string;
  root: string;
  description: string;
  repository: SeedRepository;
  contact?: SeedContact;
  /**
   * Url for seed
   */
  site?: SeedSite;
  assets?: SeedBrowserAssets;
};

export type SeedSite = {
  url: string;
  index?: string;
};

export type SeedRepository = {
  type: "git";
  url: string;
  contact?: SeedContact;
};

export type SeedContact = {
  name: string;
  email?: string;
  url?: string;
};

export enum SeedCommands {
  ADD = "add",
  INIT = "init",
  INFO = "info",
  REMOVE = "remove",
}

export type SeedBrowserAssets = {
  seedIcon?: string;
  publisherLogo?: string;
};

export type SeedRegistryDict = { [key: string]: SeedConfig | undefined };

export const SEED_REGISTRY: SeedRegistryDict = {
  "mycelium.mycelium-site": {
    id: "mycelium.mycelium-site",
    name: "mycelium-site",
    publisher: "mycelium",
    description:
      "The Mycelium Wiki. This contains the Mycelium user guide, from getting started to advanced features. This also has information for Mycelium developers.",
    license: "Creative Commons Attribution 4.0 International",
    root: "vault",
    repository: {
      type: "git",
      url: "https://github.com/myceliumhq/mycelium-site.git",
    },
    site: {
      url: "https://wiki.mycelium.so",
      index: "mycelium",
    },
    assets: {
      publisherLogo:
        "https://org-mycelium-public-assets.s3.amazonaws.com/images/tutorial-logo_small.png",
    },
  },
  "mycelium.handbook": {
    id: "mycelium.handbook",
    name: "handbook",
    publisher: "mycelium",
    description:
      "The Mycelium Company Handbook. Outlines Company Values and Principles.",
    license: "Creative Commons Attribution 4.0 International",
    root: "handbook",
    repository: {
      type: "git",
      url: "https://github.com/myceliumhq/handbook.git",
    },
    site: {
      url: "https://handbook.mycelium.so",
      index: "handbook",
    },
    assets: {
      publisherLogo:
        "https://org-mycelium-public-assets.s3.amazonaws.com/images/tutorial-logo_small.png",
    },
  },
  "mycelium.templates": {
    id: "mycelium.templates",
    name: "templates",
    publisher: "mycelium",
    description: "Templates that can be applied to your new Mycelium notes.",
    license: "Creative Commons Attribution 4.0 International",
    root: "templates",
    repository: {
      type: "git",
      url: "https://github.com/myceliumhq/templates.git",
    },
    assets: {
      publisherLogo:
        "https://org-mycelium-public-assets.s3.amazonaws.com/images/tutorial-logo_small.png",
    },
  },
  "mycelium.tldr": {
    id: "mycelium.tldr",
    name: "tldr",
    publisher: "mycelium",
    description: "Documentation for the most popular CLI tools.",
    license: "Creative Commons Attribution 4.0 International",
    root: "vault",
    repository: {
      type: "git",
      url: "https://github.com/kevinslin/seed-tldr.git",
    },
    site: {
      url: "https://tldr.mycelium.so",
      index: "cli",
    },
    assets: {
      publisherLogo:
        "https://org-mycelium-public-assets.s3.amazonaws.com/images/tutorial-logo_small.png",
    },
  },
  "mycelium.xkcd": {
    id: "mycelium.xkcd",
    name: "xkcd",
    publisher: "mycelium",
    description: "A complete collection of xkcd comics by Randall Monroe",
    license: "Creative Commons Attribution-NonCommercial 2.5 License",
    root: "vault",
    repository: {
      type: "git",
      url: "https://github.com/kevinslin/seed-xkcd.git",
    },
    site: {
      url: "https://xkcd.mycelium.so",
    },
    assets: {
      publisherLogo:
        "https://org-mycelium-public-assets.s3.amazonaws.com/images/tutorial-logo_small.png",
    },
  },
  "mycelium.aws": {
    id: "mycelium.aws",
    name: "aws",
    publisher: "mycelium",
    description: "Documentation on all things related to AWS.",
    license: "Multiple",
    root: "vault",
    repository: {
      type: "git",
      url: "https://github.com/myceliumhq/mycelium-aws-vault.git",
    },
    site: {
      url: "https://aws.mycelium.so",
    },
    assets: {
      publisherLogo:
        "https://org-mycelium-public-assets.s3.amazonaws.com/images/tutorial-logo_small.png",
    },
  },
};
