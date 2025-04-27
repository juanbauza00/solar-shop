## Objetivo del Proyecto:
El objetivo del proyecto consiste en desarrollar un sistema de e-commerce que incorpora funciones de gestión de recursos, como lo haría un ERP simplificado, que permitirá a los clientes adquirir productos de manera eficiente y a la empresa gestionar su inventario, ventas y pedidos de forma óptima.
La solución se compone de una aplicación web con una interfaz visual moderna y responsiva que facilita la experiencia del usuario y un backend que maneja las operaciones críticas del negocio.

## Estructuración del proyecto:
La estructuración de carpetas del proyecto fue diseñada específicamente para facilitar la migración a una arquitectura de microservicios en el futuro.

### Backend
```
solar-shop-backend/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── solarshop/
│   │   │           ├── config/                  # Configuraciones globales
│   │   │           ├── exception/               # Manejo de excepciones global
│   │   │           ├── security/                # Configuración de seguridad global
│   │   │           ├── util/                    # Utilidades compartidas
│   │   │           ├── module/                  # Módulos (microservicios)
│   │   │           │   ├── user/                # Microservicio de usuarios
│   │   │           │   ├── product/             # Microservicio de productos
│   │   │           │   ├── order/               # Microservicio de pedidos y ventas
│   │   │           │   ├── notification/        # Microservicio de logs y notificaciones
│   │   │           │   └── report/              # Microservicio de reportes
│   │   │           └── SolarShopApplication.java
│   │   └── resources/
│   │       ├── application.yml                  # Configuración global
│   │       ├── application-dev.yml              # Configuración para desarrollo
│   │       └── application-prod.yml             # Configuración para producción
│   └── test/
└── pom.xml                                      # Dependencias y configuración de Maven
```

### Estructura interna de cada microservicio
```
module/<nombre-servicio>/
├── api/
│   ├── controller/         # Controladores REST
│   └── dto/                # Objetos de transferencia de datos
├── domain/
│   ├── model/              # Entidades de dominio
│   ├── repository/         # Interfaces de repositorio
│   └── service/            # Servicios de dominio
├── infrastructure/
│   ├── persistence/        # Implementaciones de repositorios
│   └── external/           # Servicios externos e integraciones
└── config/                 # Configuraciones específicas del módulo
```

### Frontend
```
solar-shop-frontend/
├── src/
│   ├── app/
│   │   ├── core/                     # Módulo core
│   │   │   ├── auth/                 # Servicios de autenticación
│   │   │   ├── interceptors/         # Interceptores HTTP
│   │   │   ├── guards/               # Guards de ruta
│   │   │   └── models/               # Modelos globales
│   │   ├── shared/                   # Componentes y utilidades compartidas
│   │   │   ├── components/           # Componentes reutilizables
│   │   │   ├── directives/           # Directivas personalizadas
│   │   │   ├── pipes/                # Pipes personalizados
│   │   │   └── services/             # Servicios compartidos
│   │   ├── features/                 # Funcionalidades de la aplicación
│   │   │   ├── auth/                 # Funcionalidad de autenticación
│   │   │   ├── products/             # Funcionalidad de productos
│   │   │   ├── cart-checkout/        # Carrito y proceso de compra
│   │   │   ├── admin/                # Panel de administración
│   │   │   │   ├── product-management/
│   │   │   │   ├── order-management/
│   │   │   │   └── user-management/
│   │   │   └── user-profile/         # Perfil de usuario
│   │   ├── layout/                   # Componentes de diseño
│   │   │   ├── header/
│   │   │   ├── footer/
│   │   │   └── sidebar/
│   │   ├── app-routing.module.ts
│   │   ├── app.component.ts
│   │   └── app.module.ts
│   ├── assets/                       # Imágenes, iconos, etc.
│   ├── environments/                 # Configuraciones de entorno
│   └── styles/                       # Estilos globales
├── angular.json
└── package.json
```
