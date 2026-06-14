import type { Appearance } from "@clerk/types";
import { dark } from "@clerk/themes";

export const clerkAppearance: Appearance = {
  baseTheme: dark,
  variables: {
    colorPrimary: "#28BDAE",
    colorDanger: "#EF4444",
    colorSuccess: "#28BDAE",
    colorWarning: "#F59E0B",
    colorBackground: "#11171B",
    colorInputBackground: "#161D22",
    colorInputText: "#F5F6F7",
    colorText: "#F5F6F7",
    colorTextSecondary: "#B8C0C8",
    colorTextOnPrimaryBackground: "#0A0D10",
    colorNeutral: "#62696F",
    colorShimmer: "rgba(255, 255, 255, 0.04)",
    borderRadius: "10px",
    fontFamily: '"Space Grotesk", "Helvetica Neue", system-ui, sans-serif',
    fontFamilyButtons: '"Space Grotesk", "Helvetica Neue", system-ui, sans-serif',
    fontSize: "14px",
  },
  layout: {
    socialButtonsVariant: "blockButton",
    socialButtonsPlacement: "top",
    showOptionalFields: false,
  },
  elements: {
    rootBox: {
      width: "100%",
    },
    cardBox: {
      width: "100%",
      boxShadow: "none",
    },
    card: {
      backgroundColor: "#11171B",
      border: "1px solid rgba(255, 255, 255, 0.08)",
      boxShadow: "0 1px 2px rgba(0, 0, 0, 0.4), 0 8px 24px rgba(0, 0, 0, 0.35)",
    },
    headerTitle: {
      fontFamily: '"Anton", "Bebas Neue", Impact, sans-serif',
      fontWeight: "400",
      letterSpacing: "-0.02em",
      textTransform: "uppercase",
      fontSize: "1.35rem",
      color: "#F5F6F7",
    },
    headerSubtitle: {
      color: "#B8C0C8",
    },
    formButtonPrimary: {
      backgroundColor: "#28BDAE",
      color: "#0A0D10",
      fontWeight: "600",
      boxShadow: "none",
      "&:hover, &:focus, &:active": {
        backgroundColor: "#3DD4C4",
      },
    },
    socialButtonsBlockButton: {
      backgroundColor: "#161D22",
      border: "1px solid rgba(255, 255, 255, 0.08)",
      color: "#F5F6F7",
      boxShadow: "none",
      "&:hover": {
        backgroundColor: "#1C232C",
      },
    },
    socialButtonsBlockButtonText: {
      color: "#F5F6F7",
      fontWeight: "500",
    },
    formFieldInput: {
      backgroundColor: "#161D22",
      border: "1px solid rgba(255, 255, 255, 0.08)",
      color: "#F5F6F7",
      boxShadow: "none",
      "&:focus": {
        borderColor: "rgba(40, 189, 174, 0.45)",
        boxShadow: "0 0 0 2px rgba(40, 189, 174, 0.15)",
      },
    },
    formFieldLabel: {
      color: "#B8C0C8",
    },
    footerActionLink: {
      color: "#28BDAE",
      "&:hover": {
        color: "#3DD4C4",
      },
    },
    identityPreviewEditButton: {
      color: "#28BDAE",
    },
    formFieldAction: {
      color: "#28BDAE",
    },
    dividerLine: {
      backgroundColor: "rgba(255, 255, 255, 0.08)",
    },
    dividerText: {
      color: "#62696F",
    },
    footer: {
      background: "transparent",
    },
    footerActionText: {
      color: "#B8C0C8",
    },
    formResendCodeLink: {
      color: "#28BDAE",
    },
    identityPreviewText: {
      color: "#F5F6F7",
    },
    identityPreviewEditButtonIcon: {
      color: "#28BDAE",
    },
    otpCodeFieldInput: {
      backgroundColor: "#161D22",
      border: "1px solid rgba(255, 255, 255, 0.08)",
      color: "#F5F6F7",
    },
    alert: {
      backgroundColor: "rgba(40, 189, 174, 0.12)",
      border: "1px solid rgba(40, 189, 174, 0.25)",
    },
    alertText: {
      color: "#F5F6F7",
    },
    formFieldInputShowPasswordButton: {
      color: "#B8C0C8",
    },
    footerPages: {
      background: "#11171B",
    },
    logoBox: {
      height: "36px",
    },
    developmentModeWarning: {
      backgroundColor: "rgba(245, 158, 11, 0.08)",
      borderTop: "1px solid rgba(245, 158, 11, 0.18)",
      color: "#F59E0B",
    },
  },
};
