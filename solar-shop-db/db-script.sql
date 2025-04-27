-- Script para crear todas las bases de datos del sistema de e-commerce
-- Fecha: 26 de abril de 2025

-- =======================================================
-- MICROSERVICIO 1: USUARIOS
-- =======================================================

-- Tabla de tipos de documento
CREATE TABLE document_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    abbreviation VARCHAR(10) NOT NULL UNIQUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de países
CREATE TABLE countries (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    code VARCHAR(2) NOT NULL UNIQUE,
    phone_code VARCHAR(5) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de estados/provincias
CREATE TABLE states (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(10) NOT NULL,
    country_id INT NOT NULL REFERENCES countries(id),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de estados de sesión
CREATE TABLE session_statuses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de roles (creamos primero porque es referenciada en users)
CREATE TABLE roles (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    created_by BIGINT -- Se actualizará después de crear la tabla users
);

-- Tabla principal de usuarios
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    document_type_id INT REFERENCES document_types(id),
    document_number VARCHAR(50) NOT NULL UNIQUE,
    birth_date DATE NOT NULL,
    country_id INT REFERENCES countries(id),
    state_id INT REFERENCES states(id),
    role_id INT REFERENCES roles(id),
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status_id INT REFERENCES session_statuses(id),
    phone VARCHAR(20),
    is_deleted BOOLEAN DEFAULT FALSE,
    email_verified BOOLEAN DEFAULT FALSE,
    email_verification_token VARCHAR(100) UNIQUE,
    token_expiry TIMESTAMP,
    failed_login_attempts SMALLINT DEFAULT 0,
    account_locked_until TIMESTAMP,
    last_password_change TIMESTAMP,
    password_reset_token VARCHAR(100) UNIQUE
);

-- Actualizar la clave foránea en roles
ALTER TABLE roles
ADD CONSTRAINT roles_created_by_fkey FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL;

-- Tabla de direcciones de usuarios
CREATE TABLE addresses (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    address_line TEXT NOT NULL,
    number VARCHAR(10),
    postal_code VARCHAR(20) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state_id BIGINT REFERENCES states(id),
    country_id BIGINT REFERENCES countries(id),
    additional_info TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de historial de contraseñas
CREATE TABLE password_history (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    password_hash VARCHAR(255) NOT NULL,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45)
);

-- =======================================================
-- MICROSERVICIO 2: PRODUCTOS
-- =======================================================

-- Tabla de categorías de productos
CREATE TABLE categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    parent_id BIGINT REFERENCES categories(id),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    slug VARCHAR(255) NOT NULL UNIQUE
);

-- Tabla de productos (catálogo)
CREATE TABLE products (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    slug VARCHAR(255) NOT NULL UNIQUE,
    meta_title VARCHAR(255),
    meta_description TEXT,
    category_id BIGINT REFERENCES categories(id)
);

-- Tabla de características de productos
CREATE TABLE characteristics (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    product_id BIGINT REFERENCES products(id),
    is_filterable BOOLEAN DEFAULT FALSE,
    is_required BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de valores predefinidos para características
CREATE TABLE characteristic_values (
    id BIGSERIAL PRIMARY KEY,
    characteristic_id BIGINT REFERENCES characteristics(id),
    value VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de instancias de productos (stock)
CREATE TABLE product_instances (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT REFERENCES products(id),
    quantity INTEGER NOT NULL CHECK (quantity >= 0),
    price NUMERIC(11,2) NOT NULL CHECK (price >= 0),
    sku VARCHAR(100) NOT NULL UNIQUE,
    barcode VARCHAR(100) UNIQUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    min_stock_level INTEGER DEFAULT 5
);

-- Tabla de características específicas de instancias de productos
CREATE TABLE product_instance_characteristics (
    id BIGSERIAL PRIMARY KEY,
    product_instance_id BIGINT REFERENCES product_instances(id),
    characteristic_id BIGINT REFERENCES characteristics(id),
    characteristic_value_id BIGINT REFERENCES characteristic_values(id),
    manual_value VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de movimientos de stock
CREATE TABLE stock_movements (
    id BIGSERIAL PRIMARY KEY,
    product_instance_id BIGINT REFERENCES product_instances(id),
    quantity INTEGER NOT NULL,
    movement_type VARCHAR(50) CHECK (movement_type IN ('IN', 'OUT', 'ADJUST')),
    reference_id BIGINT,
    reference_type VARCHAR(50),
    reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT REFERENCES users(id) ON DELETE SET NULL
);

-- Tabla de descuentos en productos
CREATE TABLE discounts (
    id BIGSERIAL PRIMARY KEY,
    product_instance_id BIGINT REFERENCES product_instances(id) ON DELETE CASCADE,
    discount_percent NUMERIC(5,2) CHECK (discount_percent BETWEEN 0 AND 100),
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    discount_code VARCHAR(50) UNIQUE
);

-- Tabla de imágenes de productos
CREATE TABLE product_images (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT REFERENCES products(id),
    product_instance_id BIGINT REFERENCES product_instances(id),
    image_path VARCHAR(255) NOT NULL,
    alt_text VARCHAR(255),
    is_primary BOOLEAN DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de historial de precios
CREATE TABLE price_history (
    id BIGSERIAL PRIMARY KEY,
    product_instance_id BIGINT REFERENCES product_instances(id),
    old_price NUMERIC(11,2) NOT NULL,
    new_price NUMERIC(11,2) NOT NULL,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    changed_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    reason TEXT
);

-- =======================================================
-- MICROSERVICIO 3: PEDIDOS Y VENTAS
-- =======================================================

-- Tabla de estados de pedidos
CREATE TABLE order_statuses (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT
);

-- Tabla de métodos de pago
CREATE TABLE payment_methods (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de estados de pago
CREATE TABLE payment_statuses (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT
);

-- Tabla de tipos de factura
CREATE TABLE invoice_types (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT
);

-- Tabla de estados de facturas
CREATE TABLE invoice_statuses (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT
);

-- Tabla de fuentes de descuentos
CREATE TABLE discount_sources (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE
);

-- Tabla de pedidos
CREATE TABLE orders (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status_id BIGINT NOT NULL REFERENCES order_statuses(id),
    address_id BIGINT REFERENCES addresses(id) ON DELETE RESTRICT,
    notes TEXT
);

-- Tabla de historial de estados de pedidos
CREATE TABLE order_status_history (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT REFERENCES orders(id) ON DELETE CASCADE,
    status_id BIGINT REFERENCES order_statuses(id),
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    changed_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    notes TEXT
);

-- Tabla de ventas
CREATE TABLE sales (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT REFERENCES orders(id) ON DELETE CASCADE,
    sale_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    payment_method_id BIGINT REFERENCES payment_methods(id),
    payment_status_id BIGINT REFERENCES payment_statuses(id),
    discount NUMERIC(5,2) DEFAULT 0,
    discount_source_id BIGINT REFERENCES discount_sources(id)
);

-- Tabla de detalles de ventas
CREATE TABLE sales_details (
    id BIGSERIAL PRIMARY KEY,
    sale_id BIGINT REFERENCES sales(id) ON DELETE CASCADE,
    product_id BIGINT REFERENCES product_instances(id),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    price NUMERIC(11,2) NOT NULL CHECK (price >= 0),
    product_discount NUMERIC(5,2) DEFAULT 0 CHECK (product_discount >= 0 AND product_discount <= 100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de facturas
CREATE TABLE invoices (
    id BIGSERIAL PRIMARY KEY,
    sale_id BIGINT REFERENCES sales(id) ON DELETE RESTRICT,
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    invoice_type_id BIGINT REFERENCES invoice_types(id),
    issue_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    subtotal NUMERIC(11,2) NOT NULL CHECK (subtotal >= 0),
    taxes NUMERIC(11,2) NOT NULL CHECK (taxes >= 0),
    total NUMERIC(11,2) NOT NULL CHECK (total >= 0),
    status_id BIGINT REFERENCES invoice_statuses(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    pdf_path VARCHAR(255)
);

-- =======================================================
-- MICROSERVICIO 4: LOGS Y NOTIFICACIONES
-- =======================================================

-- Tabla de logs del sistema
CREATE TABLE system_logs (
    id BIGSERIAL PRIMARY KEY,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    level VARCHAR(20) NOT NULL,
    message TEXT NOT NULL,
    user_id BIGINT,
    exception_details TEXT,
    additional_data JSONB
);

-- Tabla de logs de auditoría
CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id BIGINT,
    action VARCHAR(50) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id VARCHAR(100) NOT NULL,
    old_value JSONB,
    new_value JSONB
);

-- Tabla de notificaciones
CREATE TABLE notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    type VARCHAR(50) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    status VARCHAR(50) NOT NULL,
    source_service VARCHAR(100) NOT NULL
);

-- Tabla de canales de notificación
CREATE TABLE notification_channels (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL,
    provider VARCHAR(100) NOT NULL,
    config JSONB NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

-- Tabla de plantillas de notificación
CREATE TABLE notification_templates (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    type VARCHAR(50) NOT NULL,
    subject_template TEXT,
    content_template TEXT NOT NULL,
    variables JSONB,
    is_active BOOLEAN DEFAULT TRUE
);
