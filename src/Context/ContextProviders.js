import ProductProvider from "./CartProvider";
import AlertProvider from "./AlertProvider";
import UserProvider from "./UserProvider";
import ThemeProvider from "./ThemeProvider";
import WishlistProvider from "./WishlistProvider";
import CheckoutProvider from "./CheckoutProvider";

export default function ContextProviders({children}) {
  return (
    <ThemeProvider>
      <AlertProvider>
        <CheckoutProvider>
          <UserProvider>
            <WishlistProvider>
              <ProductProvider>
                {children}
              </ProductProvider>
            </WishlistProvider>
          </UserProvider>
        </CheckoutProvider>
      </AlertProvider>
    </ThemeProvider>
  )
}
