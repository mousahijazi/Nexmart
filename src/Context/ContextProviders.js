import ProductProvider from "./CartProvider";
import AlertProvider from "./AlertProvider";
import UserProvider from "./UserProvider";
import ThemeProvider from "./ThemeProvider";

export default function ContextProviders({children}) {
  return (
    <ThemeProvider>
      <AlertProvider>
        <UserProvider>
          <ProductProvider>
            {children}
          </ProductProvider>
        </UserProvider>
      </AlertProvider>
    </ThemeProvider>
  )
}
