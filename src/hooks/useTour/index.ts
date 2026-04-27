import { useCallback, useEffect, useRef } from "react";
import { driver, type DriveStep, type Driver } from "driver.js";
import "driver.js/dist/driver.css";
import "./tour.css";

import { useTheme } from "../../context/theme/useTheme";
import { useTranslation } from "react-i18next";

type UseTourOptions = {
  onBeforeStart?: () => void;
};

export const useTour = (
  options?: UseTourOptions,
): { startTour: () => void } => {
  const { theme } = useTheme();
  const { t } = useTranslation("common");
  const driverRef = useRef<Driver | null>(null);

  const buildSteps = useCallback(
    (): DriveStep[] => [
      {
        element: '[data-tour="header"]',
        popover: {
          title: t("tour.steps.header.title"),
          description: t("tour.steps.header.description"),
          side: "bottom",
          align: "start",
        },
      },
      {
        element: '[data-tour="examples-btn"]',
        popover: {
          title: t("tour.steps.examples.title"),
          description: t("tour.steps.examples.description"),
          side: "bottom",
          align: "start",
        },
      },
      {
        element: '[data-tour="syntax-guide-btn"]',
        popover: {
          title: t("tour.steps.syntaxGuide.title"),
          description: t("tour.steps.syntaxGuide.description"),
          side: "bottom",
          align: "end",
        },
      },
      {
        element: '[data-tour="universe-editor"]',
        popover: {
          title: t("tour.steps.universe.title"),
          description: t("tour.steps.universe.description"),
          side: "right",
          align: "start",
        },
      },
      {
        element: '[data-tour="constants-editor"]',
        popover: {
          title: t("tour.steps.constants.title"),
          description: t("tour.steps.constants.description"),
          side: "right",
          align: "start",
        },
      },
      {
        element: '[data-tour="predicates-editor"]',
        popover: {
          title: t("tour.steps.predicates.title"),
          description: t("tour.steps.predicates.description"),
          side: "right",
          align: "start",
        },
      },
      {
        element: '[data-tour="errors-panel"]',
        popover: {
          title: t("tour.steps.errors.title"),
          description: t("tour.steps.errors.description"),
          side: "bottom",
          align: "start",
        },
      },
      {
        element: '[data-tour="query-editor"]',
        popover: {
          title: t("tour.steps.query.title"),
          description: t("tour.steps.query.description"),
          side: "top",
          align: "start",
        },
      },
      {
        element: '[data-tour="run-query-btn"]',
        popover: {
          title: t("tour.steps.runQuery.title"),
          description: t("tour.steps.runQuery.description"),
          side: "top",
          align: "start",
        },
      },
      {
        element: '[data-tour="visualization-panel"]',
        popover: {
          title: t("tour.steps.visualization.title"),
          description: t("tour.steps.visualization.description"),
          side: "left",
          align: "start",
        },
      },
      {
        element: '[data-tour="export-btn"]',
        popover: {
          title: t("tour.steps.export.title"),
          description: t("tour.steps.export.description"),
          side: "top",
          align: "end",
        },
      },
    ],
    [t],
  );

  useEffect(() => {
    driverRef.current = driver({
      showProgress: true,
      animate: true,
      overlayColor: theme === "dark" ? "rgba(0,0,0,0.7)" : "rgba(0,0,0,0.4)",
      popoverClass: `app-tour-popover app-tour-popover--${theme}`,
      nextBtnText: t("tour.next"),
      prevBtnText: t("tour.prev"),
      doneBtnText: t("tour.done"),
      steps: buildSteps(),
    });

    return () => {
      driverRef.current?.destroy();
      driverRef.current = null;
    };
  }, [theme, buildSteps, t]);

  const startTour = useCallback(() => {
    if (driverRef.current?.isActive()) return;
    options?.onBeforeStart?.();
    requestAnimationFrame(() => {
      driverRef.current?.setSteps(buildSteps());
      driverRef.current?.drive();
    });
  }, [buildSteps, options]);

  return { startTour };
};
