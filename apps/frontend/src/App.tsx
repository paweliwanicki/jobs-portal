import "./App.scss";
import { useRouter } from "./hooks/useRouter";
import ThemeProvider from "./providers/ThemeProvider";
import SnackBarProvider from "./providers/SnackBarProvider";
import { CookiesProvider } from "react-cookie";
import { RouterProvider } from "react-router-dom";
import UserProvider from "./providers/UserProvider";
import OfferProvider from "./providers/OfferProvider";
import DictionaryProvider from "./providers/DictionaryProvider";
import FiltersProvider from "./providers/FiltersProvider";

const { router } = useRouter();

export function App() {
  return (
    <CookiesProvider>
      <UserProvider>
        <ThemeProvider>
          <DictionaryProvider>
            <SnackBarProvider>
              <OfferProvider>
                <FiltersProvider>
                  <RouterProvider router={router} />
                </FiltersProvider>
              </OfferProvider>
            </SnackBarProvider>
          </DictionaryProvider>
        </ThemeProvider>
      </UserProvider>
    </CookiesProvider>
  );
}

export default App;
