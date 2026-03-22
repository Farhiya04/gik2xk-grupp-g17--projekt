import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ProductList from "./ProductList";
import ProductDetail from "./ProductDetail";
import Cart from "./Cart";
import Admin from "./Admin";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Red Bull Energy Shop ⚡</h1>
          {/* NY STRUKTUR FÖR MENYN */}
          <nav className="main-nav">
            <Link to="/" className="nav-link center-link">
              Hem
            </Link>
            <div className="nav-right-group">
              <Link to="/cart" className="nav-link">
                Varukorg 🛒
              </Link>
              <Link to="/admin" className="nav-link">
                Admin ⚙️
              </Link>
            </div>
          </nav>
        </header>

        <Routes>
          <Route
            path="/"
            element={
              <main className="container">
                <ProductList />
              </main>
            }
          />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
