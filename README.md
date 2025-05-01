# Solar Shop - Plataforma de E-commerce

## Objetivo del Proyecto
El objetivo del proyecto consiste en desarrollar un sistema de e-commerce que incorpora funciones de gestión de recursos (similar a un ERP simplificado), permitiendo a los clientes adquirir productos de manera eficiente y a la empresa gestionar su inventario, ventas y pedidos de forma óptima.

La solución se compone de una aplicación web con una interfaz visual moderna y responsiva que facilita la experiencia del usuario y un backend que maneja las operaciones críticas del negocio.

El sistema está diseñado inicialmente para la venta de paneles solares, pero con una arquitectura flexible que permite adaptarse a cualquier tipo de producto en el futuro.

## Tecnologías Utilizadas

### Frontend
- **Framework**: Angular 19+
- **Estilos**: Bootstrap 5, Bootstrap Icons
- **Autenticación**: JWT (JSON Web Tokens)
- **Estado**: Signals de Angular

### Backend
- **Framework**: Spring Boot 3.2+ (Java 17+)
- **Seguridad**: Spring Security con JWT
- **Bases de datos**: 
  - PostgreSQL para datos estructurados
  - MongoDB para logs y notificaciones
- **API**: RESTful

## Estructura del Proyecto

### Frontend (Angular)
```
solar-shop-frontend/
├── src/
│   ├── app/
│   │   ├── core/                     # Módulo core
│   │   │   ├── auth/                 # Servicios de autenticación
│   │   │   ├── guards/               # Guards de ruta
│   │   │   ├── interceptors/         # Interceptores HTTP
│   │   │   ├── models/               # Modelos de datos
│   │   ├── features/                 # Módulos de funcionalidades
│   │   │   ├── admin/                # Panel de administración
│   │   │   │   ├── dashboard/
│   │   │   │   ├── order-management/
│   │   │   │   ├── product-management/
│   │   │   │   ├── shared/
│   │   │   │   └── user-management/
│   │   │   ├── auth/                 # Autenticación
│   │   │   │   ├── forgot-password/
│   │   │   │   ├── login/
│   │   │   │   └── register/
│   │   │   ├── cart-checkout/        # Carrito y proceso de compra
│   │   │   │   ├── cart/
│   │   │   │   └── checkout/
│   │   │   ├── products/             # Catálogo de productos
│   │   │   │   ├── product-detail/
│   │   │   │   └── product-list/
│   │   │   └── user-profile/         # Perfil de usuario
│   │   │       ├── addresses/
│   │   │       ├── order-detail/
│   │   │       ├── order-history/
│   │   │       └── profile/
│   │   ├── layout/                   # Componentes de layout
│   │   │   ├── footer/
│   │   │   ├── header/
│   │   │   └── home/
│   │   ├── shared/                   # Componentes y servicios compartidos
│   │   │   ├── components/
│   │   │   └── services/
│   │   ├── app.component.ts          # Componente raíz
│   │   ├── app.routes.ts             # Rutas principales
│   │   └── app.config.ts             # Configuración de la aplicación
│   ├── assets/                       # Recursos estáticos
│   └── environments/                 # Configuración de entornos
├── angular.json                      # Configuración de Angular
└── package.json                      # Dependencias del proyecto
```

### Backend (Spring Boot)
```
solar-shop-backend/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── solarshop/
│   │   │           ├── SolarShopApplication.java
│   │   │           ├── security/                # Configuración de seguridad
│   │   │           │   ├── JwtAuthenticationEntryPoint.java
│   │   │           │   ├── JwtAuthenticationFilter.java
│   │   │           │   ├── JwtTokenProvider.java
│   │   │           │   ├── SecurityConfig.java
│   │   │           │   └── UserSecurity.java
│   │   │           └── module/                  # Módulos de negocio
│   │   │               ├── notification/        # Gestión de notificaciones
│   │   │               │   ├── api/
│   │   │               │   └── domain/
│   │   │               ├── order/               # Gestión de pedidos
│   │   │               │   ├── api/
│   │   │               │   └── domain/
│   │   │               ├── product/             # Gestión de productos
│   │   │               │   ├── api/
│   │   │               │   └── domain/
│   │   │               └── user/                # Gestión de usuarios
│   │   │                   ├── api/
│   │   │                   └── domain/
│   │   └── resources/
│   │       ├── application.yml       # Configuración principal
│   │       ├── application-dev.yml   # Configuración de desarrollo
│   │       └── application-prod.yml  # Configuración de producción
│   └── test/                         # Pruebas unitarias e integración
└── pom.xml                           # Dependencias y configuración Maven
```

## Estructura de Base de Datos

El proyecto utiliza dos bases de datos:

1. **PostgreSQL**: Para datos estructurados (usuarios, productos, pedidos, etc.)
2. **MongoDB**: Para logs, auditoría y notificaciones

El script principal de base de datos se encuentra en `solar-shop-db/db-script.sql`.

## Ejecución del Proyecto

### Frontend
```bash
cd solar-shop-frontend
npm install
npm start
```

### Backend
```bash
cd solar-shop-backend
mvn clean install
mvn spring-boot:run
```

## Autores
- Equipo de Desarrollo de Solar Shop
