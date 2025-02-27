import { Outlet } from "react-router-dom";
import AppHeader from "./components/layout/app.header";

const Layout = () => {
    return (
        <>
            <AppHeader></AppHeader>
            <Outlet></Outlet>
        </>
    )
}

export default Layout;