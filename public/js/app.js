// FinanPro - Sistema de Gestión Financiera
class FinanPro {
    constructor() {
        this.currentUser = null;
        this.currentPage = 'dashboard';
        this.apiBase = '/api';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkAuth();
        this.loadDashboard();
    }

    setupEventListeners() {
        // Login form
        document.getElementById('login-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.login();
        });

        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const href = item.getAttribute('href');
                this.navigateTo(href.substring(1));
            });
        });

        // Mobile sidebar toggle
        document.getElementById('mobile-sidebar-toggle')?.addEventListener('click', () => {
            document.getElementById('sidebar').classList.toggle('-translate-x-full');
        });

        // Logout
        document.getElementById('logout-btn')?.addEventListener('click', () => {
            this.logout();
        });
    }

    async checkAuth() {
        const token = localStorage.getItem('finanpro_token');
        if (token) {
            try {
                const response = await fetch(`${this.apiBase}/auth/verify`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    this.currentUser = JSON.parse(localStorage.getItem('finanpro_user'));
                    this.showMainApp();
                } else {
                    this.showLogin();
                }
            } catch (error) {
                this.showLogin();
            }
        } else {
            this.showLogin();
        }
    }

    async login() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch(`${this.apiBase}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('finanpro_token', data.token);
                localStorage.setItem('finanpro_user', JSON.stringify(data.user));
                this.currentUser = data.user;
                this.showMainApp();
            } else {
                this.showError('Usuario o contraseña incorrectos');
            }
        } catch (error) {
            this.showError('Error de conexión');
        }
    }

    logout() {
        localStorage.removeItem('finanpro_token');
        localStorage.removeItem('finanpro_user');
        this.currentUser = null;
        this.showLogin();
    }

    showLogin() {
        document.getElementById('loading').classList.add('hidden');
        document.getElementById('login-screen').classList.remove('hidden');
        document.getElementById('main-app').classList.add('hidden');
    }

    showMainApp() {
        document.getElementById('loading').classList.add('hidden');
        document.getElementById('login-screen').classList.add('hidden');
        document.getElementById('main-app').classList.remove('hidden');
    }

    navigateTo(page) {
        this.currentPage = page;
        document.getElementById('page-title').textContent = this.getPageTitle(page);
        this.loadPage(page);
        this.updateActiveNav(page);
    }

    getPageTitle(page) {
        const titles = {
            dashboard: 'Dashboard',
            operaciones: 'Operaciones',
            clientes: 'Clientes',
            transferencias: 'Transferencias',
            cheques: 'Cheques',
            rulos: 'Rulos',
            cajeros: 'Cajeros',
            chisperos: 'Chisperos',
            gastos: 'Gastos',
            reportes: 'Reportes'
        };
        return titles[page] || 'Dashboard';
    }

    updateActiveNav(page) {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('bg-blue-50', 'text-blue-600');
        });
        const activeItem = document.querySelector(`[href="#${page}"]`);
        if (activeItem) {
            activeItem.classList.add('bg-blue-50', 'text-blue-600');
        }
    }

    async loadPage(page) {
        const contentDiv = document.getElementById('page-content');
        contentDiv.innerHTML = '<div class="flex items-center justify-center h-64"><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>';

        switch (page) {
            case 'dashboard':
                await this.loadDashboard();
                break;
            case 'operaciones':
                await this.loadOperaciones();
                break;
            case 'clientes':
                await this.loadClientes();
                break;
            case 'transferencias':
                await this.loadTransferencias();
                break;
            case 'cheques':
                await this.loadCheques();
                break;
            case 'rulos':
                await this.loadRulos();
                break;
            case 'cajeros':
                await this.loadCajeros();
                break;
            case 'chisperos':
                await this.loadChisperos();
                break;
            case 'gastos':
                await this.loadGastos();
                break;
            case 'reportes':
                await this.loadReportes();
                break;
            case 'usuarios':
                await this.loadUsuarios();
                break;
            case 'cierres':
                await this.loadCierres();
                break;
            default:
                await this.loadPlaceholder(page);
                break;
        }
    }

    async loadDashboard() {
        const content = `
            <div class="space-y-6">
                <!-- Stats Cards -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div class="bg-white rounded-xl shadow-sm p-6 card-hover">
                        <div class="flex items-center">
                            <div class="bg-green-100 p-3 rounded-lg">
                                <i class="fas fa-dollar-sign text-green-600"></i>
                            </div>
                            <div class="ml-4">
                                <p class="text-sm font-medium text-gray-600">Ingresos Hoy</p>
                                <p class="text-2xl font-bold text-gray-900">$125,000</p>
                                <p class="text-sm text-green-600">+12.5%</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-white rounded-xl shadow-sm p-6 card-hover">
                        <div class="flex items-center">
                            <div class="bg-red-100 p-3 rounded-lg">
                                <i class="fas fa-arrow-down text-red-600"></i>
                            </div>
                            <div class="ml-4">
                                <p class="text-sm font-medium text-gray-600">Egresos Hoy</p>
                                <p class="text-2xl font-bold text-gray-900">$98,500</p>
                                <p class="text-sm text-red-600">+8.2%</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-white rounded-xl shadow-sm p-6 card-hover">
                        <div class="flex items-center">
                            <div class="bg-blue-100 p-3 rounded-lg">
                                <i class="fas fa-exchange-alt text-blue-600"></i>
                            </div>
                            <div class="ml-4">
                                <p class="text-sm font-medium text-gray-600">Operaciones</p>
                                <p class="text-2xl font-bold text-gray-900">47</p>
                                <p class="text-sm text-blue-600">+5 nuevas</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-white rounded-xl shadow-sm p-6 card-hover">
                        <div class="flex items-center">
                            <div class="bg-purple-100 p-3 rounded-lg">
                                <i class="fas fa-chart-line text-purple-600"></i>
                            </div>
                            <div class="ml-4">
                                <p class="text-sm font-medium text-gray-600">Ganancia</p>
                                <p class="text-2xl font-bold text-gray-900">$26,500</p>
                                <p class="text-sm text-purple-600">+15.3%</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Alerts -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div class="bg-white rounded-xl shadow-sm p-6">
                        <h3 class="text-lg font-semibold text-gray-900 mb-4">Alertas</h3>
                        <div class="space-y-3">
                            <div class="flex items-center p-3 bg-red-50 rounded-lg">
                                <i class="fas fa-exclamation-triangle text-red-600 mr-3"></i>
                                <div>
                                    <p class="text-sm font-medium text-red-800">3 transferencias sin confirmar</p>
                                    <p class="text-xs text-red-600">Requieren atención inmediata</p>
                                </div>
                            </div>
                            <div class="flex items-center p-3 bg-yellow-50 rounded-lg">
                                <i class="fas fa-clock text-yellow-600 mr-3"></i>
                                <div>
                                    <p class="text-sm font-medium text-yellow-800">5 cheques por vencer</p>
                                    <p class="text-xs text-yellow-600">Próximos 7 días</p>
                                </div>
                            </div>
                            <div class="flex items-center p-3 bg-blue-50 rounded-lg">
                                <i class="fas fa-info-circle text-blue-600 mr-3"></i>
                                <div>
                                    <p class="text-sm font-medium text-blue-800">2 operaciones impagas</p>
                                    <p class="text-xs text-blue-600">Total: $15,000</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white rounded-xl shadow-sm p-6">
                        <h3 class="text-lg font-semibold text-gray-900 mb-4">Divisas</h3>
                        <div class="space-y-3">
                            <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <span class="font-medium">ARS</span>
                                <span class="text-lg font-bold text-green-600">$2,450,000</span>
                            </div>
                            <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <span class="font-medium">USD</span>
                                <span class="text-lg font-bold text-blue-600">$12,500</span>
                            </div>
                            <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <span class="font-medium">USDT</span>
                                <span class="text-lg font-bold text-purple-600">$8,750</span>
                            </div>
                            <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <span class="font-medium">EUR</span>
                                <span class="text-lg font-bold text-yellow-600">€3,200</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Recent Operations -->
                <div class="bg-white rounded-xl shadow-sm p-6">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-lg font-semibold text-gray-900">Operaciones Recientes</h3>
                        <button class="text-blue-600 hover:text-blue-700 text-sm font-medium">Ver todas</button>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200">
                                <tr>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#001</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Juan Pérez</td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            Entrada
                                        </span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$25,000</td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            Confirmado
                                        </span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Hace 2 horas</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
        
        document.getElementById('page-content').innerHTML = content;
    }

    async loadOperaciones() {
        const content = `
            <div class="space-y-6">
                <div class="flex items-center justify-between">
                    <h2 class="text-2xl font-bold text-gray-900">Operaciones</h2>
                    <button onclick="finanpro.showOperacionModal()" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200">
                        <i class="fas fa-plus mr-2"></i>Nueva Operación
                    </button>
                </div>

                <!-- Filters -->
                <div class="bg-white rounded-xl shadow-sm p-6">
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Cliente</label>
                            <select class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                                <option>Todos los clientes</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
                            <select class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                                <option>Todos</option>
                                <option>Entrada</option>
                                <option>Salida</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                            <select class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                                <option>Todos</option>
                                <option>Pendiente</option>
                                <option>Confirmado</option>
                                <option>Pagado</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Fecha</label>
                            <input type="date" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                        </div>
                    </div>
                </div>

                <!-- Operations Table -->
                <div class="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Divisa Entrante</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Divisa Saliente</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cotización</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comisión</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200">
                                <tr>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#001</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Juan Pérez</td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            Entrada
                                        </span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">USD</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">ARS</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$1,000</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$850</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$50</td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            Confirmado
                                        </span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button class="text-blue-600 hover:text-blue-900 mr-3">Editar</button>
                                        <button class="text-red-600 hover:text-red-900">Eliminar</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
        
        document.getElementById('page-content').innerHTML = content;
    }

    async loadClientes() {
        const content = `
            <div class="space-y-6">
                <div class="flex items-center justify-between">
                    <h2 class="text-2xl font-bold text-gray-900">Clientes</h2>
                    <button onclick="finanpro.showClienteModal()" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200">
                        <i class="fas fa-plus mr-2"></i>Nuevo Cliente
                    </button>
                </div>

                <!-- Search -->
                <div class="bg-white rounded-xl shadow-sm p-6">
                    <div class="flex space-x-4">
                        <div class="flex-1">
                            <input type="text" placeholder="Buscar clientes..." class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                        </div>
                        <button class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                            <i class="fas fa-search"></i>
                        </button>
                    </div>
                </div>

                <!-- Clients Table -->
                <div class="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DNI</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teléfono</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Operaciones</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200">
                                <tr>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#001</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Juan Pérez</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">12345678</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">+54 11 1234-5678</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">juan@email.com</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">15</td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            Activo
                                        </span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button class="text-blue-600 hover:text-blue-900 mr-3">Editar</button>
                                        <button class="text-red-600 hover:text-red-900">Eliminar</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
        
        document.getElementById('page-content').innerHTML = content;
    }

    async loadPlaceholder(page) {
        const titles = {
            transferencias: 'Transferencias',
            cheques: 'Cheques',
            rulos: 'Rulos',
            cajeros: 'Cajeros',
            chisperos: 'Chisperos',
            gastos: 'Gastos',
            reportes: 'Reportes',
            usuarios: 'Usuarios',
            cierres: 'Cierres de Caja'
        };
        
        const content = `
            <div class="text-center py-12">
                <div class="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i class="fas fa-tools text-blue-600 text-2xl"></i>
                </div>
                <h3 class="text-lg font-medium text-gray-900">${titles[page] || page}</h3>
                <p class="text-gray-500 mt-2">Funcionalidad en desarrollo</p>
                <p class="text-sm text-gray-400 mt-1">Próximamente disponible</p>
            </div>
        `;
        
        document.getElementById('page-content').innerHTML = content;
    }

    // ===== DASHBOARDS COMPLETOS =====

    async loadTransferencias() {
        const content = `
            <div class="space-y-6">
                <div class="flex items-center justify-between">
                    <h2 class="text-2xl font-bold text-gray-900">Gestión de Transferencias</h2>
                    <button onclick="finanpro.showTransferenciaModal()" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200">
                        <i class="fas fa-plus mr-2"></i>Nueva Transferencia
                    </button>
                </div>

                <!-- Stats Cards -->
                <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div class="bg-white rounded-xl shadow-sm p-6">
                        <div class="flex items-center">
                            <div class="bg-green-100 p-3 rounded-lg">
                                <i class="fas fa-check-circle text-green-600"></i>
                            </div>
                            <div class="ml-4">
                                <p class="text-sm font-medium text-gray-600">Confirmadas</p>
                                <p class="text-2xl font-bold text-gray-900">24</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-white rounded-xl shadow-sm p-6">
                        <div class="flex items-center">
                            <div class="bg-yellow-100 p-3 rounded-lg">
                                <i class="fas fa-clock text-yellow-600"></i>
                            </div>
                            <div class="ml-4">
                                <p class="text-sm font-medium text-gray-600">Pendientes</p>
                                <p class="text-2xl font-bold text-gray-900">8</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-white rounded-xl shadow-sm p-6">
                        <div class="flex items-center">
                            <div class="bg-red-100 p-3 rounded-lg">
                                <i class="fas fa-times-circle text-red-600"></i>
                            </div>
                            <div class="ml-4">
                                <p class="text-sm font-medium text-gray-600">Rechazadas</p>
                                <p class="text-2xl font-bold text-gray-900">3</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-white rounded-xl shadow-sm p-6">
                        <div class="flex items-center">
                            <div class="bg-blue-100 p-3 rounded-lg">
                                <i class="fas fa-dollar-sign text-blue-600"></i>
                            </div>
                            <div class="ml-4">
                                <p class="text-sm font-medium text-gray-600">Total Hoy</p>
                                <p class="text-2xl font-bold text-gray-900">$450K</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Filters -->
                <div class="bg-white rounded-xl shadow-sm p-6">
                    <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Cuenta Origen</label>
                            <select class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                                <option>Todas las cuentas</option>
                                <option>Banco Galicia</option>
                                <option>Banco Santander</option>
                                <option>Mercado Pago</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Cuenta Destino</label>
                            <select class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                                <option>Todas las cuentas</option>
                                <option>Banco Galicia</option>
                                <option>Banco Santander</option>
                                <option>Mercado Pago</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                            <select class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                                <option>Todos</option>
                                <option>Pendiente</option>
                                <option>Confirmada</option>
                                <option>Rechazada</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Fecha Desde</label>
                            <input type="date" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Fecha Hasta</label>
                            <input type="date" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                        </div>
                    </div>
                </div>

                <!-- Transferencias Table -->
                <div class="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cuenta Origen</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cuenta Destino</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CUIT</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200">
                                <tr>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#001</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Banco Galicia</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Mercado Pago</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$25,000</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">20-12345678-9</td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            Confirmada
                                        </span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Hace 2 horas</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button class="text-blue-600 hover:text-blue-900 mr-3">Ver</button>
                                        <button class="text-green-600 hover:text-green-900 mr-3">Confirmar</button>
                                        <button class="text-red-600 hover:text-red-900">Rechazar</button>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#002</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Banco Santander</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Banco Galicia</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$15,000</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">30-98765432-1</td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                            Pendiente
                                        </span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Hace 1 hora</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button class="text-blue-600 hover:text-blue-900 mr-3">Ver</button>
                                        <button class="text-green-600 hover:text-green-900 mr-3">Confirmar</button>
                                        <button class="text-red-600 hover:text-red-900">Rechazar</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
        
        document.getElementById('page-content').innerHTML = content;
    }

    async loadCheques() {
        const content = `
            <div class="space-y-6">
                <div class="flex items-center justify-between">
                    <h2 class="text-2xl font-bold text-gray-900">Gestión de Cheques</h2>
                    <button onclick="finanpro.showChequeModal()" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200">
                        <i class="fas fa-plus mr-2"></i>Nuevo Cheque
                    </button>
                </div>

                <!-- Stats Cards -->
                <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div class="bg-white rounded-xl shadow-sm p-6">
                        <div class="flex items-center">
                            <div class="bg-blue-100 p-3 rounded-lg">
                                <i class="fas fa-money-check text-blue-600"></i>
                            </div>
                            <div class="ml-4">
                                <p class="text-sm font-medium text-gray-600">En Cartera</p>
                                <p class="text-2xl font-bold text-gray-900">12</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-white rounded-xl shadow-sm p-6">
                        <div class="flex items-center">
                            <div class="bg-green-100 p-3 rounded-lg">
                                <i class="fas fa-check text-green-600"></i>
                            </div>
                            <div class="ml-4">
                                <p class="text-sm font-medium text-gray-600">Cobrados</p>
                                <p class="text-2xl font-bold text-gray-900">8</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-white rounded-xl shadow-sm p-6">
                        <div class="flex items-center">
                            <div class="bg-red-100 p-3 rounded-lg">
                                <i class="fas fa-exclamation-triangle text-red-600"></i>
                            </div>
                            <div class="ml-4">
                                <p class="text-sm font-medium text-gray-600">Por Vencer</p>
                                <p class="text-2xl font-bold text-gray-900">5</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-white rounded-xl shadow-sm p-6">
                        <div class="flex items-center">
                            <div class="bg-purple-100 p-3 rounded-lg">
                                <i class="fas fa-dollar-sign text-purple-600"></i>
                            </div>
                            <div class="ml-4">
                                <p class="text-sm font-medium text-gray-600">Total Valor</p>
                                <p class="text-2xl font-bold text-gray-900">$180K</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Filters -->
                <div class="bg-white rounded-xl shadow-sm p-6">
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Banco</label>
                            <select class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                                <option>Todos los bancos</option>
                                <option>Banco Galicia</option>
                                <option>Banco Santander</option>
                                <option>Banco Nación</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                            <select class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                                <option>Todos</option>
                                <option>En Cartera</option>
                                <option>Cobrado</option>
                                <option>Rechazado</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Fecha Desde</label>
                            <input type="date" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Fecha Hasta</label>
                            <input type="date" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                        </div>
                    </div>
                </div>

                <!-- Cheques Table -->
                <div class="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Emisor</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Banco</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vencimiento</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200">
                                <tr>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#001</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Juan Pérez</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Banco Galicia</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$25,000</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">15/12/2024</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">15/01/2025</td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            En Cartera
                                        </span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button class="text-blue-600 hover:text-blue-900 mr-3">Ver</button>
                                        <button class="text-green-600 hover:text-green-900 mr-3">Cobrar</button>
                                        <button class="text-red-600 hover:text-red-900">Rechazar</button>
                                    </td>
                                </tr>
                                <tr class="bg-yellow-50">
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#002</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">María García</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Banco Santander</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$15,000</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">10/12/2024</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">20/12/2024</td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                            Por Vencer
                                        </span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button class="text-blue-600 hover:text-blue-900 mr-3">Ver</button>
                                        <button class="text-green-600 hover:text-green-900 mr-3">Cobrar</button>
                                        <button class="text-red-600 hover:text-red-900">Rechazar</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
        
        document.getElementById('page-content').innerHTML = content;
    }

    async loadRulos() {
        const content = `
            <div class="space-y-6">
                <div class="flex items-center justify-between">
                    <h2 class="text-2xl font-bold text-gray-900">Gestión de Rulos</h2>
                    <div class="flex space-x-3">
                        <button onclick="finanpro.showRuloModal('A')" class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200">
                            <i class="fas fa-plus mr-2"></i>Rulo A
                        </button>
                        <button onclick="finanpro.showRuloModal('B')" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200">
                            <i class="fas fa-plus mr-2"></i>Rulo B
                        </button>
                    </div>
                </div>

                <!-- Stats Cards -->
                <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div class="bg-white rounded-xl shadow-sm p-6">
                        <div class="flex items-center">
                            <div class="bg-green-100 p-3 rounded-lg">
                                <i class="fas fa-sync-alt text-green-600"></i>
                            </div>
                            <div class="ml-4">
                                <p class="text-sm font-medium text-gray-600">Rulos Activos</p>
                                <p class="text-2xl font-bold text-gray-900">8</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-white rounded-xl shadow-sm p-6">
                        <div class="flex items-center">
                            <div class="bg-blue-100 p-3 rounded-lg">
                                <i class="fas fa-dollar-sign text-blue-600"></i>
                            </div>
                            <div class="ml-4">
                                <p class="text-sm font-medium text-gray-600">Ganancia Total</p>
                                <p class="text-2xl font-bold text-gray-900">$45K</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-white rounded-xl shadow-sm p-6">
                        <div class="flex items-center">
                            <div class="bg-purple-100 p-3 rounded-lg">
                                <i class="fas fa-chart-line text-purple-600"></i>
                            </div>
                            <div class="ml-4">
                                <p class="text-sm font-medium text-gray-600">Promedio Diario</p>
                                <p class="text-2xl font-bold text-gray-900">$2.5K</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-white rounded-xl shadow-sm p-6">
                        <div class="flex items-center">
                            <div class="bg-yellow-100 p-3 rounded-lg">
                                <i class="fas fa-clock text-yellow-600"></i>
                            </div>
                            <div class="ml-4">
                                <p class="text-sm font-medium text-gray-600">Pendientes</p>
                                <p class="text-2xl font-bold text-gray-900">3</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Rulos Tabs -->
                <div class="bg-white rounded-xl shadow-sm">
                    <div class="border-b border-gray-200">
                        <nav class="-mb-px flex space-x-8 px-6" aria-label="Tabs">
                            <button class="border-blue-500 text-blue-600 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
                                Rulo A
                            </button>
                            <button class="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
                                Rulo B
                            </button>
                        </nav>
                    </div>
                    
                    <div class="p-6">
                        <!-- Rulo A Content -->
                        <div class="space-y-6">
                            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <!-- Ingresos -->
                                <div class="bg-gray-50 rounded-lg p-6">
                                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Ingresos por Cuenta</h3>
                                    <div class="space-y-3">
                                        <div class="flex justify-between items-center p-3 bg-white rounded-lg">
                                            <span class="font-medium">Banco Galicia</span>
                                            <span class="text-lg font-bold text-green-600">$125,000</span>
                                        </div>
                                        <div class="flex justify-between items-center p-3 bg-white rounded-lg">
                                            <span class="font-medium">Mercado Pago</span>
                                            <span class="text-lg font-bold text-green-600">$85,000</span>
                                        </div>
                                        <div class="flex justify-between items-center p-3 bg-white rounded-lg">
                                            <span class="font-medium">Banco Santander</span>
                                            <span class="text-lg font-bold text-green-600">$65,000</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- Egresos -->
                                <div class="bg-gray-50 rounded-lg p-6">
                                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Egresos por Cuenta</h3>
                                    <div class="space-y-3">
                                        <div class="flex justify-between items-center p-3 bg-white rounded-lg">
                                            <span class="font-medium">Banco Galicia</span>
                                            <span class="text-lg font-bold text-red-600">$110,000</span>
                                        </div>
                                        <div class="flex justify-between items-center p-3 bg-white rounded-lg">
                                            <span class="font-medium">Mercado Pago</span>
                                            <span class="text-lg font-bold text-red-600">$75,000</span>
                                        </div>
                                        <div class="flex justify-between items-center p-3 bg-white rounded-lg">
                                            <span class="font-medium">Banco Santander</span>
                                            <span class="text-lg font-bold text-red-600">$55,000</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Ganancia -->
                            <div class="bg-gradient-to-r from-green-500 to-blue-500 rounded-lg p-6 text-white">
                                <h3 class="text-lg font-semibold mb-2">Ganancia Generada por Rulo</h3>
                                <p class="text-3xl font-bold">$25,000</p>
                                <p class="text-sm opacity-90">+15.3% vs mes anterior</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.getElementById('page-content').innerHTML = content;
    }

    async loadCajeros() {
        const content = `
            <div class="space-y-6">
                <div class="flex items-center justify-between">
                    <h2 class="text-2xl font-bold text-gray-900">Gestión de Cajeros</h2>
                    <button onclick="finanpro.showCajeroModal()" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200">
                        <i class="fas fa-plus mr-2"></i>Nuevo Cajero
                    </button>
                </div>

                <!-- Stats Cards -->
                <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div class="bg-white rounded-xl shadow-sm p-6">
                        <div class="flex items-center">
                            <div class="bg-blue-100 p-3 rounded-lg">
                                <i class="fas fa-user-tie text-blue-600"></i>
                            </div>
                            <div class="ml-4">
                                <p class="text-sm font-medium text-gray-600">Total Cajeros</p>
                                <p class="text-2xl font-bold text-gray-900">12</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-white rounded-xl shadow-sm p-6">
                        <div class="flex items-center">
                            <div class="bg-green-100 p-3 rounded-lg">
                                <i class="fas fa-check-circle text-green-600"></i>
                            </div>
                            <div class="ml-4">
                                <p class="text-sm font-medium text-gray-600">Activos</p>
                                <p class="text-2xl font-bold text-gray-900">10</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-white rounded-xl shadow-sm p-6">
                        <div class="flex items-center">
                            <div class="bg-yellow-100 p-3 rounded-lg">
                                <i class="fas fa-clock text-yellow-600"></i>
                            </div>
                            <div class="ml-4">
                                <p class="text-sm font-medium text-gray-600">En Turno</p>
                                <p class="text-2xl font-bold text-gray-900">6</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-white rounded-xl shadow-sm p-6">
                        <div class="flex items-center">
                            <div class="bg-purple-100 p-3 rounded-lg">
                                <i class="fas fa-dollar-sign text-purple-600"></i>
                            </div>
                            <div class="ml-4">
                                <p class="text-sm font-medium text-gray-600">Total Operaciones</p>
                                <p class="text-2xl font-bold text-gray-900">1,247</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Cajeros Table -->
                <div class="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Operaciones</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Último Acceso</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200">
                                <tr>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#001</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Carlos López</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">carlos.lopez</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Cajero</td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            Activo
                                        </span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">156</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Hace 2 horas</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button class="text-blue-600 hover:text-blue-900 mr-3">Editar</button>
                                        <button class="text-red-600 hover:text-red-900">Desactivar</button>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#002</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Ana Martínez</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">ana.martinez</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Supervisor</td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            Activo
                                        </span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">89</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Hace 1 hora</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button class="text-blue-600 hover:text-blue-900 mr-3">Editar</button>
                                        <button class="text-red-600 hover:text-red-900">Desactivar</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
        
        document.getElementById('page-content').innerHTML = content;
    }

    async loadChisperos() {
        const content = `
            <div class="space-y-6">
                <div class="flex items-center justify-between">
                    <h2 class="text-2xl font-bold text-gray-900">Gestión de Chisperos</h2>
                    <button onclick="finanpro.showChisperoModal()" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200">
                        <i class="fas fa-plus mr-2"></i>Nuevo Chispero
                    </button>
                </div>

                <!-- Stats Cards -->
                <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div class="bg-white rounded-xl shadow-sm p-6">
                        <div class="flex items-center">
                            <div class="bg-blue-100 p-3 rounded-lg">
                                <i class="fas fa-handshake text-blue-600"></i>
                            </div>
                            <div class="ml-4">
                                <p class="text-sm font-medium text-gray-600">Total Chisperos</p>
                                <p class="text-2xl font-bold text-gray-900">25</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-white rounded-xl shadow-sm p-6">
                        <div class="flex items-center">
                            <div class="bg-green-100 p-3 rounded-lg">
                                <i class="fas fa-dollar-sign text-green-600"></i>
                            </div>
                            <div class="ml-4">
                                <p class="text-sm font-medium text-gray-600">Comisiones Pagadas</p>
                                <p class="text-2xl font-bold text-gray-900">$12K</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-white rounded-xl shadow-sm p-6">
                        <div class="flex items-center">
                            <div class="bg-yellow-100 p-3 rounded-lg">
                                <i class="fas fa-clock text-yellow-600"></i>
                            </div>
                            <div class="ml-4">
                                <p class="text-sm font-medium text-gray-600">Pendientes</p>
                                <p class="text-2xl font-bold text-gray-900">$3.5K</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-white rounded-xl shadow-sm p-6">
                        <div class="flex items-center">
                            <div class="bg-purple-100 p-3 rounded-lg">
                                <i class="fas fa-chart-line text-purple-600"></i>
                            </div>
                            <div class="ml-4">
                                <p class="text-sm font-medium text-gray-600">Promedio Mensual</p>
                                <p class="text-2xl font-bold text-gray-900">$2.8K</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Chisperos Table -->
                <div class="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teléfono</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Operaciones</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comisión Total</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado Pago</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Último Pago</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200">
                                <tr>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#001</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Roberto Silva</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">+54 11 1234-5678</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">45</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$2,500</td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            Pagado
                                        </span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">15/12/2024</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button class="text-blue-600 hover:text-blue-900 mr-3">Ver</button>
                                        <button class="text-green-600 hover:text-green-900 mr-3">Pagar</button>
                                        <button class="text-red-600 hover:text-red-900">Eliminar</button>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#002</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Laura Fernández</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">+54 11 9876-5432</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">32</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$1,800</td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                            Pendiente
                                        </span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">10/12/2024</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button class="text-blue-600 hover:text-blue-900 mr-3">Ver</button>
                                        <button class="text-green-600 hover:text-green-900 mr-3">Pagar</button>
                                        <button class="text-red-600 hover:text-red-900">Eliminar</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
        
        document.getElementById('page-content').innerHTML = content;
    }

    async loadGastos() {
        const content = `
            <div class="space-y-6">
                <div class="flex items-center justify-between">
                    <h2 class="text-2xl font-bold text-gray-900">Gestión de Gastos</h2>
                    <button onclick="finanpro.showGastoModal()" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200">
                        <i class="fas fa-plus mr-2"></i>Nuevo Gasto
                    </button>
                </div>

                <!-- Stats Cards -->
                <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div class="bg-white rounded-xl shadow-sm p-6">
                        <div class="flex items-center">
                            <div class="bg-red-100 p-3 rounded-lg">
                                <i class="fas fa-receipt text-red-600"></i>
                            </div>
                            <div class="ml-4">
                                <p class="text-sm font-medium text-gray-600">Total Gastos</p>
                                <p class="text-2xl font-bold text-gray-900">$8.5K</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-white rounded-xl shadow-sm p-6">
                        <div class="flex items-center">
                            <div class="bg-yellow-100 p-3 rounded-lg">
                                <i class="fas fa-clock text-yellow-600"></i>
                            </div>
                            <div class="ml-4">
                                <p class="text-sm font-medium text-gray-600">Pendientes</p>
                                <p class="text-2xl font-bold text-gray-900">$2.1K</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-white rounded-xl shadow-sm p-6">
                        <div class="flex items-center">
                            <div class="bg-green-100 p-3 rounded-lg">
                                <i class="fas fa-check text-green-600"></i>
                            </div>
                            <div class="ml-4">
                                <p class="text-sm font-medium text-gray-600">Autorizados</p>
                                <p class="text-2xl font-bold text-gray-900">$6.4K</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-white rounded-xl shadow-sm p-6">
                        <div class="flex items-center">
                            <div class="bg-purple-100 p-3 rounded-lg">
                                <i class="fas fa-user text-purple-600"></i>
                            </div>
                            <div class="ml-4">
                                <p class="text-sm font-medium text-gray-600">Cajeros</p>
                                <p class="text-2xl font-bold text-gray-900">8</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Filters -->
                <div class="bg-white rounded-xl shadow-sm p-6">
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Cajero</label>
                            <select class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                                <option>Todos los cajeros</option>
                                <option>Carlos López</option>
                                <option>Ana Martínez</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
                            <select class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                                <option>Todas las categorías</option>
                                <option>Comida</option>
                                <option>Transporte</option>
                                <option>Otros</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                            <select class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                                <option>Todos</option>
                                <option>Pendiente</option>
                                <option>Autorizado</option>
                                <option>Rechazado</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Fecha</label>
                            <input type="date" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                        </div>
                    </div>
                </div>

                <!-- Gastos Table -->
                <div class="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cajero</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Motivo</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200">
                                <tr>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#001</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Carlos López</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Comida</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$500</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Almuerzo equipo</td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            Autorizado
                                        </span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">15/12/2024</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button class="text-blue-600 hover:text-blue-900 mr-3">Ver</button>
                                        <button class="text-green-600 hover:text-green-900 mr-3">Autorizar</button>
                                        <button class="text-red-600 hover:text-red-900">Rechazar</button>
                                    </td>
                                </tr>
                                <tr class="bg-yellow-50">
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#002</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Ana Martínez</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Transporte</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$1,200</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Taxi urgente</td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                            Pendiente
                                        </span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">15/12/2024</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button class="text-blue-600 hover:text-blue-900 mr-3">Ver</button>
                                        <button class="text-green-600 hover:text-green-900 mr-3">Autorizar</button>
                                        <button class="text-red-600 hover:text-red-900">Rechazar</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
        
        document.getElementById('page-content').innerHTML = content;
    }

    async loadReportes() {
        const content = `
            <div class="space-y-6">
                <div class="flex items-center justify-between">
                    <h2 class="text-2xl font-bold text-gray-900">Reportes y Analytics</h2>
                    <div class="flex space-x-3">
                        <button onclick="finanpro.exportarReporte('excel')" class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200">
                            <i class="fas fa-file-excel mr-2"></i>Exportar Excel
                        </button>
                        <button onclick="finanpro.exportarReporte('pdf')" class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-200">
                            <i class="fas fa-file-pdf mr-2"></i>Exportar PDF
                        </button>
                    </div>
                </div>

                <!-- Report Types -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div class="bg-white rounded-xl shadow-sm p-6 cursor-pointer hover:shadow-md transition duration-200" onclick="finanpro.cargarReporte('saldos')">
                        <div class="flex items-center">
                            <div class="bg-blue-100 p-3 rounded-lg">
                                <i class="fas fa-wallet text-blue-600"></i>
                            </div>
                            <div class="ml-4">
                                <p class="text-sm font-medium text-gray-600">Saldos de Clientes</p>
                                <p class="text-lg font-bold text-gray-900">Ver Reporte</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-white rounded-xl shadow-sm p-6 cursor-pointer hover:shadow-md transition duration-200" onclick="finanpro.cargarReporte('cajas')">
                        <div class="flex items-center">
                            <div class="bg-green-100 p-3 rounded-lg">
                                <i class="fas fa-cash-register text-green-600"></i>
                            </div>
                            <div class="ml-4">
                                <p class="text-sm font-medium text-gray-600">Saldos de Cajas</p>
                                <p class="text-lg font-bold text-gray-900">Ver Reporte</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-white rounded-xl shadow-sm p-6 cursor-pointer hover:shadow-md transition duration-200" onclick="finanpro.cargarReporte('ganancias')">
                        <div class="flex items-center">
                            <div class="bg-purple-100 p-3 rounded-lg">
                                <i class="fas fa-chart-line text-purple-600"></i>
                            </div>
                            <div class="ml-4">
                                <p class="text-sm font-medium text-gray-600">Ganancias</p>
                                <p class="text-lg font-bold text-gray-900">Ver Reporte</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-white rounded-xl shadow-sm p-6 cursor-pointer hover:shadow-md transition duration-200" onclick="finanpro.cargarReporte('comisiones')">
                        <div class="flex items-center">
                            <div class="bg-yellow-100 p-3 rounded-lg">
                                <i class="fas fa-handshake text-yellow-600"></i>
                            </div>
                            <div class="ml-4">
                                <p class="text-sm font-medium text-gray-600">Comisiones</p>
                                <p class="text-lg font-bold text-gray-900">Ver Reporte</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Filters -->
                <div class="bg-white rounded-xl shadow-sm p-6">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Filtros de Reporte</h3>
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Fecha Desde</label>
                            <input type="date" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Fecha Hasta</label>
                            <input type="date" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Usuario</label>
                            <select class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                                <option>Todos los usuarios</option>
                                <option>Carlos López</option>
                                <option>Ana Martínez</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Tipo de Operación</label>
                            <select class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                                <option>Todas las operaciones</option>
                                <option>Entrada</option>
                                <option>Salida</option>
                            </select>
                        </div>
                    </div>
                </div>

                <!-- Report Content -->
                <div class="bg-white rounded-xl shadow-sm p-6">
                    <div class="flex items-center justify-between mb-6">
                        <h3 class="text-lg font-semibold text-gray-900">Reporte de Ganancias - Diciembre 2024</h3>
                        <div class="flex space-x-2">
                            <button class="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">Hoy</button>
                            <button class="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">Semana</button>
                            <button class="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg">Mes</button>
                            <button class="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">Año</button>
                        </div>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div class="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
                            <h4 class="text-lg font-semibold mb-2">Ingresos</h4>
                            <p class="text-3xl font-bold">$125,000</p>
                            <p class="text-sm opacity-90">+12.5% vs mes anterior</p>
                        </div>
                        
                        <div class="bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-6 text-white">
                            <h4 class="text-lg font-semibold mb-2">Egresos</h4>
                            <p class="text-3xl font-bold">$98,500</p>
                            <p class="text-sm opacity-90">+8.2% vs mes anterior</p>
                        </div>
                        
                        <div class="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                            <h4 class="text-lg font-semibold mb-2">Ganancia</h4>
                            <p class="text-3xl font-bold">$26,500</p>
                            <p class="text-sm opacity-90">+15.3% vs mes anterior</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.getElementById('page-content').innerHTML = content;
    }

    async loadUsuarios() {
        const content = `
            <div class="space-y-6">
                <div class="flex items-center justify-between">
                    <h2 class="text-2xl font-bold text-gray-900">Gestión de Usuarios</h2>
                    <button onclick="finanpro.showUsuarioModal()" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200">
                        <i class="fas fa-plus mr-2"></i>Nuevo Usuario
                    </button>
                </div>

                <!-- Stats Cards -->
                <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div class="bg-white rounded-xl shadow-sm p-6">
                        <div class="flex items-center">
                            <div class="bg-blue-100 p-3 rounded-lg">
                                <i class="fas fa-users text-blue-600"></i>
                            </div>
                            <div class="ml-4">
                                <p class="text-sm font-medium text-gray-600">Total Usuarios</p>
                                <p class="text-2xl font-bold text-gray-900">15</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-white rounded-xl shadow-sm p-6">
                        <div class="flex items-center">
                            <div class="bg-green-100 p-3 rounded-lg">
                                <i class="fas fa-user-shield text-green-600"></i>
                            </div>
                            <div class="ml-4">
                                <p class="text-sm font-medium text-gray-600">Administradores</p>
                                <p class="text-2xl font-bold text-gray-900">3</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-white rounded-xl shadow-sm p-6">
                        <div class="flex items-center">
                            <div class="bg-yellow-100 p-3 rounded-lg">
                                <i class="fas fa-user-tie text-yellow-600"></i>
                            </div>
                            <div class="ml-4">
                                <p class="text-sm font-medium text-gray-600">Cajeros</p>
                                <p class="text-2xl font-bold text-gray-900">8</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-white rounded-xl shadow-sm p-6">
                        <div class="flex items-center">
                            <div class="bg-purple-100 p-3 rounded-lg">
                                <i class="fas fa-user-check text-purple-600"></i>
                            </div>
                            <div class="ml-4">
                                <p class="text-sm font-medium text-gray-600">Activos</p>
                                <p class="text-2xl font-bold text-gray-900">12</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Users Table -->
                <div class="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Último Acceso</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200">
                                <tr>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#001</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Juan Pérez</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">juan.perez</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Administrador</td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            Activo
                                        </span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Hace 2 horas</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button class="text-blue-600 hover:text-blue-900 mr-3">Editar</button>
                                        <button class="text-yellow-600 hover:text-yellow-900 mr-3">Reset Pass</button>
                                        <button class="text-red-600 hover:text-red-900">Desactivar</button>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#002</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">María García</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">maria.garcia</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Cajero</td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            Activo
                                        </span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Hace 1 hora</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button class="text-blue-600 hover:text-blue-900 mr-3">Editar</button>
                                        <button class="text-yellow-600 hover:text-yellow-900 mr-3">Reset Pass</button>
                                        <button class="text-red-600 hover:text-red-900">Desactivar</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
        
        document.getElementById('page-content').innerHTML = content;
    }

    async loadCierres() {
        const content = `
            <div class="space-y-6">
                <div class="flex items-center justify-between">
                    <h2 class="text-2xl font-bold text-gray-900">Cierres de Caja</h2>
                    <button onclick="finanpro.showCierreModal()" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200">
                        <i class="fas fa-plus mr-2"></i>Nuevo Cierre
                    </button>
                </div>

                <!-- Stats Cards -->
                <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div class="bg-white rounded-xl shadow-sm p-6">
                        <div class="flex items-center">
                            <div class="bg-green-100 p-3 rounded-lg">
                                <i class="fas fa-check-circle text-green-600"></i>
                            </div>
                            <div class="ml-4">
                                <p class="text-sm font-medium text-gray-600">Cierres Hoy</p>
                                <p class="text-2xl font-bold text-gray-900">8</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-white rounded-xl shadow-sm p-6">
                        <div class="flex items-center">
                            <div class="bg-blue-100 p-3 rounded-lg">
                                <i class="fas fa-dollar-sign text-blue-600"></i>
                            </div>
                            <div class="ml-4">
                                <p class="text-sm font-medium text-gray-600">Total ARS</p>
                                <p class="text-2xl font-bold text-gray-900">$450K</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-white rounded-xl shadow-sm p-6">
                        <div class="flex items-center">
                            <div class="bg-yellow-100 p-3 rounded-lg">
                                <i class="fas fa-dollar-sign text-yellow-600"></i>
                            </div>
                            <div class="ml-4">
                                <p class="text-sm font-medium text-gray-600">Total USD</p>
                                <p class="text-2xl font-bold text-gray-900">$12K</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-white rounded-xl shadow-sm p-6">
                        <div class="flex items-center">
                            <div class="bg-red-100 p-3 rounded-lg">
                                <i class="fas fa-exclamation-triangle text-red-600"></i>
                            </div>
                            <div class="ml-4">
                                <p class="text-sm font-medium text-gray-600">Pendientes</p>
                                <p class="text-2xl font-bold text-gray-900">2</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Cierres Table -->
                <div class="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cajero</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Divisa</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Saldo Inicial</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Saldo Final</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Diferencia</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200">
                                <tr>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#001</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Carlos López</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">ARS</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$50,000</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$45,500</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">-$4,500</td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            Cerrado
                                        </span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button class="text-blue-600 hover:text-blue-900 mr-3">Ver</button>
                                        <button class="text-green-600 hover:text-green-900 mr-3">Firmar</button>
                                        <button class="text-red-600 hover:text-red-900">Imprimir</button>
                                    </td>
                                </tr>
                                <tr class="bg-yellow-50">
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#002</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Ana Martínez</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">USD</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$5,000</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$4,800</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">-$200</td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                            Pendiente
                                        </span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button class="text-blue-600 hover:text-blue-900 mr-3">Ver</button>
                                        <button class="text-green-600 hover:text-green-900 mr-3">Firmar</button>
                                        <button class="text-red-600 hover:text-red-900">Imprimir</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
        
        document.getElementById('page-content').innerHTML = content;
    }

    showOperacionModal() {
        const modal = `
            <div id="operacion-modal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                    <div class="mt-3">
                        <h3 class="text-lg font-medium text-gray-900 mb-4">Nueva Operación</h3>
                        <form id="operacion-form" class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Cliente</label>
                                <select class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" required>
                                    <option value="">Seleccionar cliente</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Tipo de Transacción</label>
                                <select class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" required>
                                    <option value="">Seleccionar tipo</option>
                                    <option value="entrada">Entrada</option>
                                    <option value="salida">Salida</option>
                                </select>
                            </div>
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Divisa Entrante</label>
                                    <select class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" required>
                                        <option value="">Divisa</option>
                                        <option value="ARS">ARS</option>
                                        <option value="USD">USD</option>
                                        <option value="USDT">USDT</option>
                                        <option value="EUR">EUR</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Divisa Saliente</label>
                                    <select class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" required>
                                        <option value="">Divisa</option>
                                        <option value="ARS">ARS</option>
                                        <option value="USD">USD</option>
                                        <option value="USDT">USDT</option>
                                        <option value="EUR">EUR</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Monto</label>
                                <input type="number" step="0.01" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" required>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Cotización</label>
                                <input type="number" step="0.01" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" required>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Comisión</label>
                                <input type="number" step="0.01" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" required>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Notas</label>
                                <textarea class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" rows="3"></textarea>
                            </div>
                            <div class="flex justify-end space-x-3">
                                <button type="button" onclick="finanpro.closeModal()" class="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300">
                                    Cancelar
                                </button>
                                <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                    Guardar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modal);
    }

    showClienteModal() {
        const modal = `
            <div id="cliente-modal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                    <div class="mt-3">
                        <h3 class="text-lg font-medium text-gray-900 mb-4">Nuevo Cliente</h3>
                        <form id="cliente-form" class="space-y-4">
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                                    <input type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" required>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Apellido</label>
                                    <input type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" required>
                                </div>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">DNI</label>
                                <input type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" required>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                                <input type="tel" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                <input type="email" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Dirección</label>
                                <textarea class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" rows="2"></textarea>
                            </div>
                            <div class="flex justify-end space-x-3">
                                <button type="button" onclick="finanpro.closeModal()" class="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300">
                                    Cancelar
                                </button>
                                <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                    Guardar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modal);
    }

    closeModal() {
        const modal = document.getElementById('operacion-modal') || document.getElementById('cliente-modal');
        if (modal) {
            modal.remove();
        }
    }

    showError(message) {
        alert(message);
    }
}

// Initialize the application
const finanpro = new FinanPro(); 