// AutomationImpactAnalyzer - Report Generator
class ReportGenerator {
    constructor() {
        this.templates = {
            executiveSummary: this.getExecutiveSummaryTemplate(),
            taskDetails: this.getTaskDetailsTemplate(),
            charts: this.getChartsTemplate(),
            recommendations: this.getRecommendationsTemplate()
        };
    }

    generateInteractiveReport(analysisData) {
        const { job, tasks, results } = analysisData;
        
        return `
            <div class="space-y-8">
                ${this.generateExecutiveSummary(results.summary, job)}
                ${this.generateChartsSection(results.tasks)}
                ${this.generateTasksDetailsSection(results.tasks)}
                ${this.generateRecommendationsSection(results)}
                ${this.generateActionPlan(results)}
                ${this.generateExportSection()}
            </div>
        `;
    }

    generateExecutiveSummary(summary, jobInfo) {
        const automationScore = this.calculateOverallScore(summary);
        const scoreColor = this.getScoreColor(automationScore);
        
        return `
            <div class="bg-white rounded-lg shadow-lg p-8">
                <div class="flex items-center justify-between mb-6">
                    <h2 class="text-3xl font-bold text-gray-800">
                        <i class="fas fa-chart-line text-blue-600 mr-3"></i>
                        Résumé Exécutif
                    </h2>
                    <div class="text-right">
                        <div class="text-sm text-gray-500">Score Global d'Automatisation</div>
                        <div class="text-4xl font-bold ${scoreColor}">${automationScore}/10</div>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div class="bg-blue-50 p-6 rounded-lg">
                        <div class="flex items-center">
                            <i class="fas fa-tasks text-blue-600 text-2xl mr-3"></i>
                            <div>
                                <div class="text-2xl font-bold text-blue-800">${summary.total_tasks}</div>
                                <div class="text-sm text-blue-600">Tâches analysées</div>
                            </div>
                        </div>
                    </div>

                    <div class="bg-green-50 p-6 rounded-lg">
                        <div class="flex items-center">
                            <i class="fas fa-clock text-green-600 text-2xl mr-3"></i>
                            <div>
                                <div class="text-2xl font-bold text-green-800">${summary.total_time_savings_weekly}h</div>
                                <div class="text-sm text-green-600">Gain hebdomadaire</div>
                            </div>
                        </div>
                    </div>

                    <div class="bg-purple-50 p-6 rounded-lg">
                        <div class="flex items-center">
                            <i class="fas fa-percentage text-purple-600 text-2xl mr-3"></i>
                            <div>
                                <div class="text-2xl font-bold text-purple-800">${summary.automation_percentage_average}%</div>
                                <div class="text-sm text-purple-600">Automatisation moyenne</div>
                            </div>
                        </div>
                    </div>

                    <div class="bg-yellow-50 p-6 rounded-lg">
                        <div class="flex items-center">
                            <i class="fas fa-euro-sign text-yellow-600 text-2xl mr-3"></i>
                            <div>
                                <div class="text-2xl font-bold text-yellow-800">${this.formatCurrency(summary.financial_impact.yearly_savings_euro)}</div>
                                <div class="text-sm text-yellow-600">Économies annuelles</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div class="bg-gray-50 p-6 rounded-lg">
                        <h3 class="text-lg font-semibold text-gray-800 mb-4">
                            <i class="fas fa-chart-pie text-blue-600 mr-2"></i>
                            Répartition par Niveau d'Automatisation
                        </h3>
                        <div class="space-y-3">
                            <div class="flex justify-between items-center">
                                <span class="flex items-center">
                                    <div class="w-4 h-4 bg-green-500 rounded mr-3"></div>
                                    Élevé (≥70%)
                                </span>
                                <span class="font-semibold">${summary.automation_distribution.high} tâches</span>
                            </div>
                            <div class="flex justify-between items-center">
                                <span class="flex items-center">
                                    <div class="w-4 h-4 bg-yellow-500 rounded mr-3"></div>
                                    Moyen (40-69%)
                                </span>
                                <span class="font-semibold">${summary.automation_distribution.medium} tâches</span>
                            </div>
                            <div class="flex justify-between items-center">
                                <span class="flex items-center">
                                    <div class="w-4 h-4 bg-red-500 rounded mr-3"></div>
                                    Faible (<40%)
                                </span>
                                <span class="font-semibold">${summary.automation_distribution.low} tâches</span>
                            </div>
                        </div>
                    </div>

                    <div class="bg-gray-50 p-6 rounded-lg">
                        <h3 class="text-lg font-semibold text-gray-800 mb-4">
                            <i class="fas fa-calculator text-green-600 mr-2"></i>
                            Analyse Financière
                        </h3>
                        <div class="space-y-3">
                            <div class="flex justify-between">
                                <span>Investissement initial :</span>
                                <span class="font-semibold text-red-600">${this.formatCurrency(summary.financial_impact.development_investment_euro)}</span>
                            </div>
                            <div class="flex justify-between">
                                <span>Économies annuelles :</span>
                                <span class="font-semibold text-green-600">+${this.formatCurrency(summary.financial_impact.yearly_savings_euro)}</span>
                            </div>
                            <div class="flex justify-between">
                                <span>Retour sur investissement :</span>
                                <span class="font-semibold">${Math.round(summary.financial_impact.payback_months)} mois</span>
                            </div>
                            <div class="flex justify-between border-t pt-2">
                                <span class="font-semibold">Bénéfice net (3 ans) :</span>
                                <span class="font-bold text-green-700">+${this.formatCurrency(summary.financial_impact.net_benefit_3_years)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-l-4 border-blue-500">
                    <h3 class="text-lg font-semibold text-gray-800 mb-2">
                        <i class="fas fa-lightbulb text-yellow-500 mr-2"></i>
                        Analyse Contextuelle
                    </h3>
                    <p class="text-gray-700">
                        Pour le poste de <strong>"${jobInfo.title}"</strong> dans le secteur <strong>"${this.getSectorName(jobInfo.sector)}"</strong>, 
                        l'automatisation par IA présente un potentiel <strong>${this.getAutomationPotentialLabel(automationScore)}</strong>. 
                        Avec ${summary.total_time_savings_weekly} heures économisées par semaine, 
                        cela représente une libération de <strong>${Math.round((summary.total_time_savings_weekly / summary.total_current_hours_weekly) * 100)}%</strong> 
                        de votre temps de travail actuel.
                    </p>
                </div>
            </div>
        `;
    }

    generateChartsSection(tasks) {
        return `
            <div class="bg-white rounded-lg shadow-lg p-8">
                <h2 class="text-2xl font-bold text-gray-800 mb-6">
                    <i class="fas fa-chart-bar text-purple-600 mr-3"></i>
                    Visualisations Interactives
                </h2>

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div class="bg-gray-50 p-6 rounded-lg">
                        <div class="chart-container">
                            <canvas id="automationChart"></canvas>
                        </div>
                    </div>

                    <div class="bg-gray-50 p-6 rounded-lg">
                        <div class="chart-container">
                            <canvas id="timeSavingsChart"></canvas>
                        </div>
                    </div>

                    <div class="lg:col-span-2 bg-gray-50 p-6 rounded-lg">
                        <div class="chart-container">
                            <canvas id="feasibilityChart"></canvas>
                        </div>
                    </div>
                </div>

                <div class="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="bg-blue-50 p-4 rounded-lg text-center">
                        <div class="text-2xl font-bold text-blue-700">${this.getHighFeasibilityCount(tasks)}</div>
                        <div class="text-sm text-blue-600">Tâches haute faisabilité (≥7)</div>
                    </div>
                    <div class="bg-green-50 p-4 rounded-lg text-center">
                        <div class="text-2xl font-bold text-green-700">${this.getHighAutomationCount(tasks)}</div>
                        <div class="text-sm text-green-600">Tâches forte automatisation (≥70%)</div>
                    </div>
                    <div class="bg-purple-50 p-4 rounded-lg text-center">
                        <div class="text-2xl font-bold text-purple-700">${this.getTotalWeeklySavings(tasks)}h</div>
                        <div class="text-sm text-purple-600">Total gains hebdomadaires</div>
                    </div>
                </div>
            </div>
        `;
    }

    generateTasksDetailsSection(tasks) {
        const sortedTasks = [...tasks].sort((a, b) => b.automation_percentage - a.automation_percentage);
        
        return `
            <div class="bg-white rounded-lg shadow-lg p-8">
                <h2 class="text-2xl font-bold text-gray-800 mb-6">
                    <i class="fas fa-list-alt text-indigo-600 mr-3"></i>
                    Analyse Détaillée des Tâches
                </h2>

                <div class="mb-6">
                    <div class="flex flex-wrap gap-2">
                        <button class="filter-btn active bg-blue-600 text-white px-4 py-2 rounded-md text-sm" data-filter="all">
                            Toutes les tâches
                        </button>
                        <button class="filter-btn bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm hover:bg-gray-300" data-filter="eleve">
                            Automatisation élevée
                        </button>
                        <button class="filter-btn bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm hover:bg-gray-300" data-filter="moyen">
                            Automatisation moyenne
                        </button>
                        <button class="filter-btn bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm hover:bg-gray-300" data-filter="faible">
                            Automatisation faible
                        </button>
                    </div>
                </div>

                <div class="space-y-6" id="tasksContainer">
                    ${sortedTasks.map(task => this.generateTaskCard(task)).join('')}
                </div>
            </div>
        `;
    }

    generateTaskCard(task) {
        const automationColor = this.getAutomationColor(task.automation_percentage);
        const feasibilityColor = this.getFeasibilityColor(task.feasibility_score);
        
        return `
            <div class="task-detail-card border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow" data-automation-level="${task.automation_level}">
                <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4">
                    <div class="flex-1">
                        <h3 class="text-xl font-semibold text-gray-800 mb-2">${task.name}</h3>
                        <p class="text-gray-600 mb-4">${task.description}</p>
                        
                        <div class="flex flex-wrap gap-2 mb-4">
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                <i class="fas fa-robot mr-1"></i>
                                ${task.ai_category.name}
                            </span>
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${automationColor}">
                                ${task.automation_percentage}% automatisable
                            </span>
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${feasibilityColor}">
                                Faisabilité: ${task.feasibility_score}/10
                            </span>
                        </div>
                    </div>

                    <div class="lg:ml-6 lg:min-w-0 lg:w-64">
                        <div class="bg-gray-50 p-4 rounded-lg">
                            <div class="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <div class="text-gray-500">Temps actuel</div>
                                    <div class="font-semibold">${task.hours}h/sem</div>
                                </div>
                                <div>
                                    <div class="text-gray-500">Temps économisé</div>
                                    <div class="font-semibold text-green-600">${task.time_savings_hours_week}h/sem</div>
                                </div>
                                <div>
                                    <div class="text-gray-500">Développement</div>
                                    <div class="font-semibold">${task.dev_time_estimate}h</div>
                                </div>
                                <div>
                                    <div class="text-gray-500">Configuration</div>
                                    <div class="font-semibold">${task.user_config_time}h</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                        <h4 class="font-medium text-gray-800 mb-2">Technologies Recommandées</h4>
                        <ul class="text-sm text-gray-600 space-y-1">
                            ${task.required_technologies.map(tech => `<li><i class="fas fa-check text-green-500 mr-2"></i>${tech}</li>`).join('')}
                        </ul>
                    </div>

                    <div>
                        <h4 class="font-medium text-gray-800 mb-2">Phases d'Implémentation</h4>
                        <div class="space-y-1">
                            ${task.implementation_phases.map(phase => `
                                <div class="text-sm">
                                    <span class="font-medium">${phase.name}:</span> ${phase.duration}h
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <div>
                        <h4 class="font-medium text-gray-800 mb-2">ROI Estimé</h4>
                        <div class="text-sm space-y-1">
                            <div>Économies annuelles: <span class="font-semibold text-green-600">${this.formatCurrency(task.roi_estimate.yearly_savings_euro)}</span></div>
                            <div>Coût développement: <span class="font-semibold text-red-600">${this.formatCurrency(task.roi_estimate.development_cost_euro)}</span></div>
                            <div>Retour: <span class="font-semibold">${task.roi_estimate.payback_months} mois</span></div>
                            <div>ROI 3 ans: <span class="font-semibold ${task.roi_estimate.roi_3_years_percent > 0 ? 'text-green-600' : 'text-red-600'}">${task.roi_estimate.roi_3_years_percent}%</span></div>
                        </div>
                    </div>
                </div>

                ${task.risk_factors && task.risk_factors.length > 0 ? `
                    <div class="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                        <h4 class="font-medium text-yellow-800 mb-2">
                            <i class="fas fa-exclamation-triangle text-yellow-600 mr-2"></i>
                            Facteurs de Risque
                        </h4>
                        <div class="space-y-2">
                            ${task.risk_factors.map(risk => `
                                <div class="text-sm">
                                    <span class="font-medium text-yellow-700">${risk.factor}:</span>
                                    <span class="text-yellow-600">${risk.description}</span>
                                    <div class="text-xs text-yellow-600 mt-1">💡 ${risk.mitigation}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }

    generateRecommendationsSection(results) {
        const recommendations = this.generateRecommendations(results);
        
        return `
            <div class="bg-white rounded-lg shadow-lg p-8">
                <h2 class="text-2xl font-bold text-gray-800 mb-6">
                    <i class="fas fa-lightbulb text-yellow-500 mr-3"></i>
                    Recommandations Stratégiques
                </h2>

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                        <h3 class="text-lg font-semibold text-gray-800 mb-4">
                            <i class="fas fa-rocket text-green-600 mr-2"></i>
                            Actions Prioritaires
                        </h3>
                        <div class="space-y-4">
                            ${recommendations.priority.map((rec, index) => `
                                <div class="flex items-start p-4 bg-green-50 rounded-lg">
                                    <div class="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                                        ${index + 1}
                                    </div>
                                    <div>
                                        <div class="font-medium text-green-800">${rec.title}</div>
                                        <div class="text-sm text-green-600">${rec.description}</div>
                                        <div class="text-xs text-green-500 mt-1">Impact: ${rec.impact}</div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <div>
                        <h3 class="text-lg font-semibold text-gray-800 mb-4">
                            <i class="fas fa-chart-line text-blue-600 mr-2"></i>
                            Optimisations Long Terme
                        </h3>
                        <div class="space-y-4">
                            ${recommendations.longTerm.map((rec, index) => `
                                <div class="flex items-start p-4 bg-blue-50 rounded-lg">
                                    <div class="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                                        ${index + 1}
                                    </div>
                                    <div>
                                        <div class="font-medium text-blue-800">${rec.title}</div>
                                        <div class="text-sm text-blue-600">${rec.description}</div>
                                        <div class="text-xs text-blue-500 mt-1">Horizon: ${rec.timeline}</div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>

                <div class="mt-8 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border-l-4 border-purple-500">
                    <h3 class="text-lg font-semibold text-gray-800 mb-4">
                        <i class="fas fa-brain text-purple-600 mr-2"></i>
                        Stratégie d'Adoption de l'IA
                    </h3>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div class="text-center">
                            <div class="text-2xl font-bold text-purple-700 mb-2">Phase 1</div>
                            <div class="text-sm text-purple-600">Automatisation Quick Wins<br>(0-6 mois)</div>
                        </div>
                        <div class="text-center">
                            <div class="text-2xl font-bold text-purple-700 mb-2">Phase 2</div>
                            <div class="text-sm text-purple-600">Optimisation Processus<br>(6-12 mois)</div>
                        </div>
                        <div class="text-center">
                            <div class="text-2xl font-bold text-purple-700 mb-2">Phase 3</div>
                            <div class="text-sm text-purple-600">Transformation Digitale<br>(12+ mois)</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    generateActionPlan(results) {
        const actionItems = this.generateActionItems(results);
        
        return `
            <div class="bg-white rounded-lg shadow-lg p-8">
                <h2 class="text-2xl font-bold text-gray-800 mb-6">
                    <i class="fas fa-tasks text-indigo-600 mr-3"></i>
                    Plan d'Action Détaillé
                </h2>

                <div class="space-y-6">
                    ${actionItems.map((item, index) => `
                        <div class="border border-gray-200 rounded-lg p-6">
                            <div class="flex items-center justify-between mb-4">
                                <h3 class="text-lg font-semibold text-gray-800">
                                    <span class="inline-flex items-center justify-center w-8 h-8 bg-indigo-600 text-white rounded-full text-sm font-bold mr-3">
                                        ${index + 1}
                                    </span>
                                    ${item.title}
                                </h3>
                                <span class="px-3 py-1 rounded-full text-sm font-medium ${this.getPriorityColor(item.priority)}">
                                    ${item.priority}
                                </span>
                            </div>
                            
                            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                                <div>
                                    <div class="text-sm text-gray-500">Durée estimée</div>
                                    <div class="font-semibold">${item.duration}</div>
                                </div>
                                <div>
                                    <div class="text-sm text-gray-500">Coût estimé</div>
                                    <div class="font-semibold">${item.cost}</div>
                                </div>
                                <div>
                                    <div class="text-sm text-gray-500">Gain attendu</div>
                                    <div class="font-semibold text-green-600">${item.benefit}</div>
                                </div>
                                <div>
                                    <div class="text-sm text-gray-500">Complexité</div>
                                    <div class="font-semibold">${item.complexity}/5</div>
                                </div>
                            </div>

                            <p class="text-gray-600 mb-4">${item.description}</p>

                            <div class="flex flex-wrap gap-2 mb-4">
                                ${item.technologies.map(tech => `
                                    <span class="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">${tech}</span>
                                `).join('')}
                            </div>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h4 class="font-medium text-gray-800 mb-2">Étapes Clés</h4>
                                    <ul class="text-sm text-gray-600 space-y-1">
                                        ${item.steps.map(step => `
                                            <li class="flex items-center">
                                                <i class="fas fa-check-circle text-green-500 mr-2"></i>
                                                ${step}
                                            </li>
                                        `).join('')}
                                    </ul>
                                </div>
                                <div>
                                    <h4 class="font-medium text-gray-800 mb-2">Ressources Nécessaires</h4>
                                    <ul class="text-sm text-gray-600 space-y-1">
                                        ${item.resources.map(resource => `
                                            <li class="flex items-center">
                                                <i class="fas fa-arrow-right text-blue-500 mr-2"></i>
                                                ${resource}
                                            </li>
                                        `).join('')}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    generateExportSection() {
        return `
            <div class="bg-white rounded-lg shadow-lg p-8">
                <h2 class="text-2xl font-bold text-gray-800 mb-6">
                    <i class="fas fa-share-alt text-teal-600 mr-3"></i>
                    Export et Partage
                </h2>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <button id="exportPdfBtn" class="export-btn bg-red-600 hover:bg-red-700 text-white p-6 rounded-lg text-center transition-colors">
                        <i class="fas fa-file-pdf text-2xl mb-2"></i>
                        <div class="font-semibold">Export PDF</div>
                        <div class="text-sm opacity-90">Rapport complet</div>
                    </button>

                    <button id="exportExcelBtn" class="export-btn bg-green-600 hover:bg-green-700 text-white p-6 rounded-lg text-center transition-colors">
                        <i class="fas fa-file-excel text-2xl mb-2"></i>
                        <div class="font-semibold">Export Excel</div>
                        <div class="text-sm opacity-90">Données détaillées</div>
                    </button>

                    <button id="shareEmailBtn" class="export-btn bg-blue-600 hover:bg-blue-700 text-white p-6 rounded-lg text-center transition-colors">
                        <i class="fas fa-envelope text-2xl mb-2"></i>
                        <div class="font-semibold">Partager par Email</div>
                        <div class="text-sm opacity-90">Envoyer le rapport</div>
                    </button>

                    <button id="saveAnalysisBtn" class="export-btn bg-purple-600 hover:bg-purple-700 text-white p-6 rounded-lg text-center transition-colors">
                        <i class="fas fa-save text-2xl mb-2"></i>
                        <div class="font-semibold">Sauvegarder</div>
                        <div class="text-sm opacity-90">Pour consultation ultérieure</div>
                    </button>
                </div>

                <div class="mt-6 p-4 bg-gray-50 rounded-lg">
                    <div class="flex items-start">
                        <i class="fas fa-info-circle text-blue-500 mr-3 mt-1"></i>
                        <div class="text-sm text-gray-600">
                            <strong>Confidentialité:</strong> Toutes vos données sont anonymisées et chiffrées. 
                            Les exports ne contiennent aucune information personnelle identifiable.
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Utility methods
    calculateOverallScore(summary) {
        // Weighted score based on automation potential and feasibility
        const automationScore = summary.automation_percentage_average / 10;
        const feasibilityScore = summary.feasibility_score_average;
        const timeSavingsScore = Math.min(10, (summary.total_time_savings_weekly / summary.total_current_hours_weekly) * 10);
        
        return Math.round(((automationScore + feasibilityScore + timeSavingsScore) / 3) * 10) / 10;
    }

    getScoreColor(score) {
        if (score >= 7) return 'text-green-600';
        if (score >= 5) return 'text-yellow-600';
        return 'text-red-600';
    }

    getAutomationColor(percentage) {
        if (percentage >= 70) return 'bg-green-100 text-green-800';
        if (percentage >= 40) return 'bg-yellow-100 text-yellow-800';
        return 'bg-red-100 text-red-800';
    }

    getFeasibilityColor(score) {
        if (score >= 7) return 'bg-green-100 text-green-800';
        if (score >= 4) return 'bg-yellow-100 text-yellow-800';
        return 'bg-red-100 text-red-800';
    }

    getPriorityColor(priority) {
        switch (priority.toLowerCase()) {
            case 'élevée':
            case 'high':
                return 'bg-red-100 text-red-800';
            case 'moyenne':
            case 'medium':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-green-100 text-green-800';
        }
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR',
            maximumFractionDigits: 0
        }).format(amount);
    }

    getSectorName(sectorKey) {
        const sectors = {
            'technologie': 'Technologie',
            'finance': 'Finance',
            'sante': 'Santé',
            'education': 'Éducation',
            'marketing': 'Marketing',
            'ressources-humaines': 'Ressources Humaines',
            'manufacturing': 'Manufacturing',
            'retail': 'Commerce de détail',
            'autre': 'Autre'
        };
        return sectors[sectorKey] || 'Non spécifié';
    }

    getAutomationPotentialLabel(score) {
        if (score >= 7) return 'élevé';
        if (score >= 5) return 'modéré';
        return 'limité';
    }

    getHighFeasibilityCount(tasks) {
        return tasks.filter(task => task.feasibility_score >= 7).length;
    }

    getHighAutomationCount(tasks) {
        return tasks.filter(task => task.automation_percentage >= 70).length;
    }

    getTotalWeeklySavings(tasks) {
        return Math.round(tasks.reduce((sum, task) => sum + task.time_savings_hours_week, 0) * 10) / 10;
    }

    generateRecommendations(results) {
        return {
            priority: [
                {
                    title: 'Automatiser les tâches administratives répétitives',
                    description: 'Commencer par les tâches avec le plus fort potentiel d\'automatisation',
                    impact: 'Gain immédiat de 20-40% du temps'
                },
                {
                    title: 'Centraliser et structurer les données',
                    description: 'Préparer l\'infrastructure pour l\'automatisation future',
                    impact: 'Facilite toutes les automatisations suivantes'
                },
                {
                    title: 'Former l\'équipe aux outils IA',
                    description: 'Développer les compétences nécessaires à l\'adoption',
                    impact: 'Accélère l\'adoption et réduit la résistance'
                }
            ],
            longTerm: [
                {
                    title: 'Intégration complète des processus',
                    description: 'Connecter tous les systèmes pour une automatisation end-to-end',
                    timeline: '12-18 mois'
                },
                {
                    title: 'IA prédictive et analytique avancée',
                    description: 'Implémenter des modèles prédictifs pour optimiser les décisions',
                    timeline: '18-24 mois'
                },
                {
                    title: 'Transformation organisationnelle',
                    description: 'Redéfinir les rôles et processus autour de l\'IA',
                    timeline: '24+ mois'
                }
            ]
        };
    }

    generateActionItems(results) {
        const highAutomationTasks = results.tasks
            .filter(task => task.automation_percentage >= 70)
            .sort((a, b) => b.roi_estimate.roi_3_years_percent - a.roi_estimate.roi_3_years_percent)
            .slice(0, 3);

        return highAutomationTasks.map(task => ({
            title: `Automatiser: ${task.name}`,
            priority: 'Élevée',
            duration: `${Math.round(task.dev_time_estimate / 160 * 4)} semaines`,
            cost: this.formatCurrency(task.roi_estimate.development_cost_euro),
            benefit: `${task.time_savings_hours_week}h/sem`,
            complexity: Math.min(5, Math.ceil(task.dev_time_estimate / 40)),
            description: `Automatisation de "${task.name}" avec un potentiel de ${task.automation_percentage}% et un ROI de ${task.roi_estimate.roi_3_years_percent}% sur 3 ans.`,
            technologies: task.required_technologies,
            steps: [
                'Analyse détaillée des besoins',
                'Conception de la solution IA',
                'Développement et tests',
                'Déploiement pilote',
                'Formation et adoption'
            ],
            resources: [
                'Développeur IA/ML',
                'Données historiques',
                'Infrastructure cloud',
                'Formation utilisateurs'
            ]
        }));
    }

    async exportToPDF(analysisData) {
        try {
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF();
            
            // Title page
            pdf.setFontSize(20);
            pdf.text('Diagnostic d\'Automatisation IA', 20, 30);
            pdf.setFontSize(12);
            pdf.text(`Poste: ${analysisData.job.title}`, 20, 50);
            pdf.text(`Secteur: ${this.getSectorName(analysisData.job.sector)}`, 20, 60);
            pdf.text(`Date: ${new Date().toLocaleDateString('fr-FR')}`, 20, 70);
            
            // Summary
            pdf.addPage();
            pdf.setFontSize(16);
            pdf.text('Résumé Exécutif', 20, 30);
            pdf.setFontSize(10);
            
            const summary = analysisData.results.summary;
            let y = 50;
            
            pdf.text(`Nombre de tâches analysées: ${summary.total_tasks}`, 20, y);
            y += 10;
            pdf.text(`Gain hebdomadaire total: ${summary.total_time_savings_weekly} heures`, 20, y);
            y += 10;
            pdf.text(`Automatisation moyenne: ${summary.automation_percentage_average}%`, 20, y);
            y += 10;
            pdf.text(`Score de faisabilité moyen: ${summary.feasibility_score_average}/10`, 20, y);
            y += 10;
            pdf.text(`Économies annuelles: ${this.formatCurrency(summary.financial_impact.yearly_savings_euro)}`, 20, y);
            
            // Tasks details
            analysisData.results.tasks.forEach((task, index) => {
                pdf.addPage();
                pdf.setFontSize(14);
                pdf.text(`Tâche ${index + 1}: ${task.name}`, 20, 30);
                pdf.setFontSize(10);
                
                y = 50;
                pdf.text(`Description: ${task.description.substring(0, 80)}...`, 20, y);
                y += 20;
                pdf.text(`Temps actuel: ${task.hours}h/semaine`, 20, y);
                y += 10;
                pdf.text(`Automatisation possible: ${task.automation_percentage}%`, 20, y);
                y += 10;
                pdf.text(`Gain estimé: ${task.time_savings_hours_week}h/semaine`, 20, y);
                y += 10;
                pdf.text(`Faisabilité technique: ${task.feasibility_score}/10`, 20, y);
                y += 10;
                pdf.text(`Temps de développement: ${task.dev_time_estimate}h`, 20, y);
                y += 10;
                pdf.text(`ROI 3 ans: ${task.roi_estimate.roi_3_years_percent}%`, 20, y);
            });
            
            // Save PDF
            pdf.save(`diagnostic-automatisation-${Date.now()}.pdf`);
            
            app.showNotification('Rapport PDF généré avec succès!', 'success');
            
        } catch (error) {
            console.error('Export PDF error:', error);
            app.showNotification('Erreur lors de la génération du PDF', 'error');
        }
    }

    // Template methods (simplified for demo)
    getExecutiveSummaryTemplate() { return ''; }
    getTaskDetailsTemplate() { return ''; }
    getChartsTemplate() { return ''; }
    getRecommendationsTemplate() { return ''; }
}