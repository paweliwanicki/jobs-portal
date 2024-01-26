import { ReactNode, useCallback, useContext, useMemo, useState } from "react";
import { SnackBarContext } from "../contexts/snackBarContext";

type SnackBarProviderProps = {
  children: ReactNode;
};

export type SnackBarVariant = "error" | "success" | "info";

const SnackBarProvider = ({ children }: SnackBarProviderProps) => {
  const [content, setContent] = useState<ReactNode>();
  const [isShowing, setIsShowing] = useState<boolean>(false);
  const [variant, setVariant] = useState<SnackBarVariant>("info");

  const handleShowSnackBar = useCallback(
    (content: ReactNode, variant: SnackBarVariant) => {
      setVariant(variant);
      setContent(content);
      setIsShowing(true);
      setTimeout(() => {
        setIsShowing(false);
      }, 2000);
    },
    [content, variant, isShowing]
  );

  const contextValue = useMemo(
    () => ({
      content,
      variant,
      isShowing,
      setIsShowing,
      setContent,
      handleShowSnackBar,
    }),
    [content, variant, isShowing]
  );

  return (
    <SnackBarContext.Provider value={contextValue}>
      {children}
    </SnackBarContext.Provider>
  );
};

export default SnackBarProvider;

export const useSnackBar = () => useContext(SnackBarContext);