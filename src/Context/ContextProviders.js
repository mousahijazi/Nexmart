import ProductProvider from "./CartProvider";
import AlertProvider from "./AlertProvider";
import UserProvider from "./UserProvider";
import ThemeProvider from "./ThemeProvider";
import WishlistProvider from "./WishlistProvider";

export default function ContextProviders({children}) {
  return (
    <ThemeProvider>
      <AlertProvider>
        <UserProvider>
          <WishlistProvider>
            <ProductProvider>
              {children}
            </ProductProvider>
          </WishlistProvider>
        </UserProvider>
      </AlertProvider>
    </ThemeProvider>
  )
}
