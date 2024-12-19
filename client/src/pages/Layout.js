import { Outlet, Link } from "react-router-dom";
import Header from '../components/Header';

export default function Layout() {
    return (
        <div className='App'>
            <Header />
            <Outlet />
        </div>
    );
}