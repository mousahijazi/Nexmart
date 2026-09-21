import ProductProvider from "./CartProvider";
import AlertProvider from "./AlertProvider";
import UserProvider from "./UserProvider";
import ThemeProvider from "./ThemeProvider";
import WishlistProvider from "./WishlistProvider";
import CheckoutProvider from "./CheckoutProvider";
import AdminProvider from "./Adminprovider";

export default function ContextProviders({children}) {
  return (
    <ThemeProvider>
      <AlertProvider>
        <UserProvider>
          <AdminProvider>
            <CheckoutProvider>
              <ProductProvider>
                <WishlistProvider>
                  {children}
                </WishlistProvider>
              </ProductProvider>
            </CheckoutProvider>
          </AdminProvider>
        </UserProvider>
      </AlertProvider>
    </ThemeProvider>
  )
}
