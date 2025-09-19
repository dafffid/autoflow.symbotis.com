// AutomationImpactAnalyzer - Main Application Logic
class AutomationImpactAnalyzer {
    constructor() {
        this.currentStep = 1;
        this.analysisData = {
            user: {},
            job: {},
            tasks: [],
            results: {}
        };
        this.taskCounter = 0;
        this.translations = {};
        this.currentLanguage = 'fr';
        
        this.init();
    }

    init() {
        this.loadTranslations();
        this.setupEventListeners();
        this.checkRGPDConsent();
        this.loadBenchmarkData();
    }

    loadTranslations() {
        this.translations = {
            fr: {
                step1Title: "Informations sur votre poste",
                step2Title: "Détail de vos tâches",
                step3Title: "Résultats de l'analyse",
                jobTitle: "Intitulé du poste",
                sector: "Secteur d'activité",
                description: "Description du poste",
                hours: "Heures par semaine",
                taskName: "Nom de la tâche",
                taskDescription: "Description de la tâche",
                taskHours: "Heures/semaine",
                analyzing: "Analyse en cours...",
                aiAnalyzing: "Notre IA analyse vos tâches",
                next: "Suivant",
                previous: "Précédent",
                analyze: "Analyser avec l'IA",
                addTask: "Ajouter une tâche",
                export: "Exporter",
                privacy: "Protection des données",
                accept: "J'accepte",
                decline: "Refuser"
            },
            en: {
                step1Title: "Job Information",
                step2Title: "Task Details",
                step3Title: "Analysis Results",
                jobTitle: "Job Title",
                sector: "Industry Sector",
                description: "Job Description",
                hours: "Hours per week",
                taskName: "Task Name",
                taskDescription: "Task Description",
                taskHours: "Hours/week",
                analyzing: "Analyzing...",
                aiAnalyzing: "Our AI is analyzing your tasks",
                next: "Next",
                previous: "Previous",
                analyze: "Analyze with AI",
                addTask: "Add Task",
                export: "Export",
                privacy: "Data Protection",
                accept: "Accept",
                decline: "Decline"
            }
        };
    }

    setupEventListeners() {
        // Language selection
        document.getElementById('languageSelect').addEventListener('change', (e) => {
            this.currentLanguage = e.target.value;
            this.updateUILanguage();
        });

        // Step navigation
        document.getElementById('nextStep1').addEventListener('click', () => this.validateAndNextStep(1));
        document.getElementById('prevStep2').addEventListener('click', () => this.goToStep(1));
        document.getElementById('analyzeBtn').addEventListener('click', () => this.startAnalysis());

        // Task management
        document.getElementById('addTask').addEventListener('click', () => this.addTaskRow());

        // RGPD consent
        document.getElementById('acceptRgpd').addEventListener('click', () => this.acceptRGPD());
        document.getElementById('declineRgpd').addEventListener('click', () => this.declineRGPD());

        // Export functionality
        document.getElementById('exportBtn').addEventListener('click', () => this.exportReport());

        // Add first task row
        this.addTaskRow();
    }

    checkRGPDConsent() {
        const consent = localStorage.getItem('rgpd_consent');
        if (!consent) {
            document.getElementById('rgpdModal').classList.remove('hidden');
        } else {
            document.getElementById('rgpdModal').classList.add('hidden');
        }
    }

    acceptRGPD() {
        localStorage.setItem('rgpd_consent', 'accepted');
        localStorage.setItem('rgpd_date', new Date().toISOString());
        document.getElementById('rgpdModal').classList.add('hidden');
        this.analysisData.user.consent_rgpd = true;
    }

    declineRGPD() {
        localStorage.setItem('rgpd_consent', 'declined');
        document.getElementById('rgpdModal').classList.add('hidden');
        alert('Vous devez accepter les conditions de protection des données pour utiliser cette application.');
        this.analysisData.user.consent_rgpd = false;
    }

    updateProgress(step) {
        const progress = (step / 3) * 100;
        document.getElementById('progressBar').style.width = `${progress}%`;
        document.getElementById('progressText').textContent = `Étape ${step} sur 3`;
        document.getElementById('progressPercentage').textContent = `${Math.round(progress)}%`;
    }

    goToStep(step) {
        // Hide all steps
        document.querySelectorAll('.step-container').forEach(el => el.classList.add('hidden'));
        
        // Show target step
        document.getElementById(`step${step}`).classList.remove('hidden');
        
        this.currentStep = step;
        this.updateProgress(step);
    }

    validateAndNextStep(fromStep) {
        if (fromStep === 1) {
            if (this.validateJobInfo()) {
                this.collectJobInfo();
                this.goToStep(2);
            }
        }
    }

    validateJobInfo() {
        const required = ['jobTitle', 'companySector', 'jobDescription', 'totalHours'];
        let valid = true;

        required.forEach(field => {
            const element = document.getElementById(field);
            const value = element.value.trim();
            
            if (!value) {
                element.classList.add('border-red-500');
                valid = false;
            } else {
                element.classList.remove('border-red-500');
            }
        });

        if (!valid) {
            this.showNotification('Veuillez remplir tous les champs obligatoires', 'error');
        }

        return valid;
    }

    collectJobInfo() {
        this.analysisData.job = {
            title: document.getElementById('jobTitle').value.trim(),
            sector: document.getElementById('companySector').value,
            description: document.getElementById('jobDescription').value.trim(),
            totalHours: parseFloat(document.getElementById('totalHours').value),
            company: document.getElementById('company').value.trim() || null
        };
    }

    addTaskRow() {
        this.taskCounter++;
        const taskId = `task_${this.taskCounter}`;
        
        const taskHtml = `
            <div class="task-card bg-gray-50 p-6 rounded-lg border border-gray-200 mb-4" id="${taskId}">
                <div class="flex justify-between items-start mb-4">
                    <h4 class="text-lg font-semibold text-gray-800">Tâche ${this.taskCounter}</h4>
                    <button class="text-red-500 hover:text-red-700" onclick="app.removeTask('${taskId}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="md:col-span-2">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Nom de la tâche *</label>
                        <input type="text" class="task-name w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                               placeholder="Ex: Rédaction de rapports mensuels">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Heures/semaine *</label>
                        <input type="number" min="0.5" max="80" step="0.5" class="task-hours w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                               placeholder="5">
                    </div>
                </div>
                
                <div class="mt-4">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Description détaillée *</label>
                    <textarea rows="3" class="task-description w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                              placeholder="Décrivez précisément cette tâche, les outils utilisés, les étapes..."></textarea>
                </div>
            </div>
        `;
        
        document.getElementById('tasksContainer').insertAdjacentHTML('beforeend', taskHtml);
    }

    removeTask(taskId) {
        const taskElement = document.getElementById(taskId);
        if (taskElement) {
            taskElement.remove();
        }
    }

    collectTasks() {
        const tasks = [];
        const taskCards = document.querySelectorAll('.task-card');
        
        taskCards.forEach(card => {
            const name = card.querySelector('.task-name').value.trim();
            const hours = parseFloat(card.querySelector('.task-hours').value);
            const description = card.querySelector('.task-description').value.trim();
            
            if (name && hours && description) {
                tasks.push({
                    name,
                    hours,
                    description
                });
            }
        });
        
        return tasks;
    }

    validateTasks() {
        const tasks = this.collectTasks();
        
        if (tasks.length === 0) {
            this.showNotification('Veuillez ajouter au moins une tâche', 'error');
            return false;
        }
        
        const totalTaskHours = tasks.reduce((sum, task) => sum + task.hours, 0);
        const jobTotalHours = this.analysisData.job.totalHours;
        
        if (totalTaskHours > jobTotalHours * 1.1) { // 10% tolerance
            this.showNotification(`La somme des heures des tâches (${totalTaskHours}h) dépasse significativement vos heures de travail totales (${jobTotalHours}h)`, 'warning');
        }
        
        return true;
    }

    async startAnalysis() {
        if (!this.validateTasks()) return;
        
        this.analysisData.tasks = this.collectTasks();
        
        // Show loading overlay
        document.getElementById('loadingOverlay').classList.remove('hidden');
        
        try {
            // Simulate AI analysis with realistic delay
            await this.performAIAnalysis();
            
            // Generate results
            await this.generateResults();
            
            // Go to results step
            this.goToStep(3);
            
        } catch (error) {
            console.error('Analysis error:', error);
            this.showNotification('Erreur lors de l\'analyse. Veuillez réessayer.', 'error');
        } finally {
            document.getElementById('loadingOverlay').classList.add('hidden');
        }
    }

    async performAIAnalysis() {
        // Simulate AI processing time
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const analysisEngine = new AnalysisEngine();
        this.analysisData.results = await analysisEngine.analyzeTasks(
            this.analysisData.job,
            this.analysisData.tasks
        );
    }

    async generateResults() {
        const reportGenerator = new ReportGenerator();
        const resultsHtml = reportGenerator.generateInteractiveReport(this.analysisData);
        document.getElementById('analysisResults').innerHTML = resultsHtml;
        
        // Initialize charts after DOM is updated
        setTimeout(() => {
            this.initializeCharts();
        }, 100);
    }

    initializeCharts() {
        if (this.analysisData.results && this.analysisData.results.tasks) {
            this.createAutomationChart();
            this.createTimeSavingsChart();
            this.createFeasibilityChart();
        }
    }

    createAutomationChart() {
        const ctx = document.getElementById('automationChart');
        if (!ctx) return;

        const tasks = this.analysisData.results.tasks;
        const labels = tasks.map(task => task.name.length > 20 ? task.name.substring(0, 20) + '...' : task.name);
        const automationData = tasks.map(task => task.automation_percentage);
        const colors = tasks.map(task => {
            if (task.automation_percentage >= 70) return '#10B981'; // Green
            if (task.automation_percentage >= 40) return '#F59E0B'; // Yellow
            return '#EF4444'; // Red
        });

        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: automationData,
                    backgroundColor: colors,
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    },
                    title: {
                        display: true,
                        text: 'Potentiel d\'Automatisation par Tâche (%)'
                    }
                }
            }
        });
    }

    createTimeSavingsChart() {
        const ctx = document.getElementById('timeSavingsChart');
        if (!ctx) return;

        const tasks = this.analysisData.results.tasks;
        const labels = tasks.map(task => task.name.length > 15 ? task.name.substring(0, 15) + '...' : task.name);
        const currentTime = tasks.map(task => task.hours);
        const savedTime = tasks.map(task => task.time_savings_hours_week);

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Temps actuel (h/sem)',
                    data: currentTime,
                    backgroundColor: '#E5E7EB'
                }, {
                    label: 'Temps économisé (h/sem)',
                    data: savedTime,
                    backgroundColor: '#3B82F6'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        stacked: false
                    },
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Heures par semaine'
                        }
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Gains de Temps par Tâche'
                    }
                }
            }
        });
    }

    createFeasibilityChart() {
        const ctx = document.getElementById('feasibilityChart');
        if (!ctx) return;

        const tasks = this.analysisData.results.tasks;
        const labels = tasks.map(task => task.name.length > 15 ? task.name.substring(0, 15) + '...' : task.name);
        const feasibilityData = tasks.map(task => task.feasibility_score);
        const devTimeData = tasks.map(task => task.dev_time_estimate / 10); // Scale for visibility

        new Chart(ctx, {
            type: 'radar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Score de Faisabilité (1-10)',
                    data: feasibilityData,
                    borderColor: '#8B5CF6',
                    backgroundColor: 'rgba(139, 92, 246, 0.2)',
                    pointBackgroundColor: '#8B5CF6'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 10,
                        ticks: {
                            stepSize: 2
                        }
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Faisabilité Technique par Tâche'
                    }
                }
            }
        });
    }

    async loadBenchmarkData() {
        // Load initial benchmark data for different sectors and task types
        const benchmarkData = [
            {
                sector: 'marketing',
                task_category: 'Analyse de données',
                ai_technology: 'Machine Learning',
                average_feasibility: 8,
                average_automation_rate: 75,
                typical_dev_time: 40,
                maturity_level: 'mature',
                success_rate: 85
            },
            {
                sector: 'finance',
                task_category: 'Traitement de documents',
                ai_technology: 'OCR + NLP',
                average_feasibility: 7,
                average_automation_rate: 60,
                typical_dev_time: 60,
                maturity_level: 'mature',
                success_rate: 80
            },
            {
                sector: 'ressources-humaines',
                task_category: 'Tri de CV',
                ai_technology: 'NLP + Classification',
                average_feasibility: 9,
                average_automation_rate: 85,
                typical_dev_time: 30,
                maturity_level: 'stable',
                success_rate: 90
            }
        ];

        try {
            // Clear existing data and add benchmark data
            await fetch('tables/automation_benchmarks', {
                method: 'DELETE'
            });

            for (const benchmark of benchmarkData) {
                await fetch('tables/automation_benchmarks', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        ...benchmark,
                        last_updated: new Date().toISOString()
                    })
                });
            }
        } catch (error) {
            console.error('Error loading benchmark data:', error);
        }
    }

    async exportReport() {
        if (!this.analysisData.results) {
            this.showNotification('Aucune analyse à exporter. Veuillez d\'abord effectuer une analyse.', 'warning');
            return;
        }

        const reportGenerator = new ReportGenerator();
        await reportGenerator.exportToPDF(this.analysisData);
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 px-6 py-3 rounded-md shadow-lg z-50 ${
            type === 'error' ? 'bg-red-500 text-white' : 
            type === 'warning' ? 'bg-yellow-500 text-white' : 
            type === 'success' ? 'bg-green-500 text-white' : 
            'bg-blue-500 text-white'
        }`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }

    updateUILanguage() {
        // This would update all UI text based on selected language
        // Implementation simplified for demo
        console.log(`Language changed to: ${this.currentLanguage}`);
    }
}

// Initialize the application
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new AutomationImpactAnalyzer();
});