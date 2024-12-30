import React from "react";

type Theme = "dark" | "light";
type DataShade = "900" | "800" | "925" | "950" | "Glassy" | string;
type DataRounded =
  | "none"
  | "small"
  | "default"
  | "medium"
  | "large"
  | "xlarge"
  | "2xlarge"
  | "3xlarge"
  | "full";

// Define the shape of the context data
interface ThemeContextType {
  theme: Theme;
  dataShade: DataShade;
  dataRounded: DataRounded;
  toggleTheme: () => void;
}

type ThemeProvider = {
  dataShade: DataShade;
  dataRounded: DataRounded;
};

const ThemeContext = React.createContext<ThemeContextType | undefined>(
  undefined
);

export const ThemeProvider: React.FC<
  React.PropsWithChildren<Omit<ThemeProvider, "children">>
> = ({ dataRounded, dataShade, children }) => {
  const [theme, setTheme] = React.useState<Theme>(() => {
    const storedTheme = localStorage.getItem("sse-theme") as Theme;
    return storedTheme || "light";
  });

  React.useEffect(() => {
    if (!localStorage.getItem("theme")) {
      localStorage.setItem("sse-theme", theme); // Save the initial theme to local storage
    }
  }, [theme]);

  const toggleTheme = () => {
    const newTheme: Theme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("sse-theme", newTheme);
  };

  React.useEffect(() => {
    const htmlElement = document.documentElement;
    htmlElement.setAttribute("class", theme);
    htmlElement.setAttribute("data-shade", dataShade);
    htmlElement.setAttribute("data-rounded", dataRounded);
  }, [theme, dataShade, dataRounded]);

  return (
    <ThemeContext.Provider
      value={{ theme, dataRounded, dataShade, toggleTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
