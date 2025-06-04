-- Crear tabla de productos
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    stock INTEGER DEFAULT 0,
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de órdenes
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    total DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de items de orden
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id),
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL
);

-- Insertar productos de ejemplo
INSERT INTO products (name, description, price, stock, image_url) VALUES
('Pintura Roja Concentrada', 'Galón de pintura roja concentrada de alta calidad', 45000, 50, 'https://via.placeholder.com/300x200/FF0000/FFFFFF?text=Rojo'),
('Pintura Azul Concentrada', 'Galón de pintura azul concentrada de alta calidad', 42000, 30, 'https://via.placeholder.com/300x200/0000FF/FFFFFF?text=Azul'),
('Pintura Verde Concentrada', 'Galón de pintura verde concentrada de alta calidad', 44000, 25, 'https://via.placeholder.com/300x200/00FF00/000000?text=Verde'),
('Pintura Amarilla Concentrada', 'Galón de pintura amarilla concentrada de alta calidad', 43000, 40, 'https://via.placeholder.com/300x200/FFFF00/000000?text=Amarillo'),
('Pintura Negra Concentrada', 'Galón de pintura negra concentrada de alta calidad', 41000, 35, 'https://via.placeholder.com/300x200/000000/FFFFFF?text=Negro'),
('Pintura Blanca Concentrada', 'Galón de pintura blanca concentrada de alta calidad', 40000, 60, 'https://via.placeholder.com/300x200/FFFFFF/000000?text=Blanco');