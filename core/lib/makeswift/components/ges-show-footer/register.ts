import {
  Checkbox,
  Color,
  Group,
  Image,
  Link,
  List,
  Number,
  Select,
  Style,
  TextInput,
} from "@makeswift/runtime/controls";

import { runtime } from "~/lib/makeswift/runtime";

import { GesShowFooterClient } from "./client";

const editableLink = Group({
  label: "Link",
  props: {
    label: TextInput({ label: "Link text", defaultValue: "Link" }),
    link: Link({ label: "Destination" }),
  },
});

runtime.registerComponent(GesShowFooterClient, {
  type: "ges-show-footer",
  label: "GES / Navigation / Show Footer",
  description:
    "GES-ready footer with a build-from-scratch mode and fully editable content.",
  icon: "navigation",
  props: {
    className: Style(),
    mode: Select({
      label: "Starting point",
      options: [
        { value: "ges", label: "GES footer preset" },
        { value: "custom", label: "Build from scratch" },
      ],
      defaultValue: "ges",
    }),
    logo: Group({
      label: "Logo",
      preferredLayout: Group.Layout.Popover,
      props: {
        show: Checkbox({ label: "Show logo", defaultValue: true }),
        image: Image({ label: "Logo override" }),
        alt: TextInput({ label: "Alt text", defaultValue: "GES" }),
        fallbackText: TextInput({
          label: "Text when no image",
          defaultValue: "Logo",
        }),
        href: TextInput({ label: "Home link", defaultValue: "/" }),
        width: Number({ label: "Logo width", suffix: "px", defaultValue: 182 }),
      },
    }),
    legalLinks: List({
      label: "Legal links",
      type: editableLink,
      getItemLabel: (item: { label?: string }) => item.label || "Legal link",
    }),
    copyright: Group({
      label: "Copyright row",
      props: {
        show: Checkbox({ label: "Show copyright", defaultValue: true }),
        includeCurrentYear: Checkbox({
          label: "Add current year automatically",
          defaultValue: true,
        }),
        text: TextInput({ label: "Copyright text", defaultValue: "" }),
        additionalLabel: TextInput({
          label: "Additional legal-link text",
          defaultValue: "",
        }),
        additionalLink: Link({ label: "Additional legal-link destination" }),
      },
    }),
    contact: Group({
      label: "Contact button",
      props: {
        show: Checkbox({ label: "Show contact button", defaultValue: true }),
        label: TextInput({ label: "Button text", defaultValue: "" }),
        link: Link({ label: "Button destination" }),
      },
    }),
    sections: List({
      label: "Optional custom link sections",
      type: Group({
        label: "Link section",
        props: {
          title: TextInput({ label: "Section title", defaultValue: "Section" }),
          links: List({
            label: "Links",
            type: editableLink,
            getItemLabel: (item: { label?: string }) => item.label || "Link",
          }),
        },
      }),
      getItemLabel: (item: { title?: string }) => item.title || "Link section",
    }),
    appearance: Group({
      label: "Appearance",
      props: {
        background: Color({ label: "Background", defaultValue: "#0a2536" }),
        text: Color({ label: "Body text", defaultValue: "#a8b8c3" }),
        link: Color({ label: "Link", defaultValue: "#88c5cf" }),
        linkHover: Color({ label: "Link hover", defaultValue: "#a8b8c3" }),
        accent: Color({ label: "Button accent", defaultValue: "#c8d32c" }),
      },
    }),
  },
});
