// AutomationImpactAnalyzer - Export Manager
class ExportManager {
    constructor() {
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.id === 'exportPdfBtn' || e.target.closest('#exportPdfBtn')) {
                this.exportToPDF();
            }
            if (e.target.id === 'exportExcelBtn' || e.target.closest('#exportExcelBtn')) {
                this.exportToExcel();
            }
            if (e.target.id === 'shareEmailBtn' || e.target.closest('#shareEmailBtn')) {
                this.shareByEmail();
            }
            if (e.target.id === 'saveAnalysisBtn' || e.target.closest('#saveAnalysisBtn')) {
                this.saveAnalysis();
            }

            // Filter buttons
            if (e.target.classList.contains('filter-btn')) {
                this.filterTasks(e.target.dataset.filter);
                this.updateFilterButtons(e.target);
            }
        });
    }

    async exportToPDF() {
        if (!app || !app.analysisData || !app.analysisData.results) {
            app.showNotification('Aucune analyse à exporter. Veuillez d\'abord effectuer une analyse.', 'warning');
            return;
        }

        const reportGenerator = new ReportGenerator();
        await reportGenerator.exportToPDF(app.analysisData);
    }

    async exportToExcel() {
        if (!app || !app.analysisData || !app.analysisData.results) {
            app.showNotification('Aucune analyse à exporter. Veuillez d\'abord effectuer une analyse.', 'warning');
            return;
        }

        try {
            const data = this.prepareExcelData(app.analysisData);
            const csvContent = this.convertToCSV(data);
            
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            
            if (link.download !== undefined) {
                const url = URL.createObjectURL(blob);
                link.setAttribute('href', url);
                link.setAttribute('download', `diagnostic-automatisation-${Date.now()}.csv`);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                app.showNotification('Export Excel généré avec succès!', 'success');
            }
        } catch (error) {
            console.error('Excel export error:', error);
            app.showNotification('Erreur lors de l\'export Excel', 'error');
        }
    }

    prepareExcelData(analysisData) {
        const data = [];
        
        // Header row
        data.push([
            'Nom de la tâche',
            'Description',
            'Heures actuelles/semaine',
            'Catégorie IA',
            'Niveau d\'automatisation',
            'Pourcentage d\'automatisation',
            'Score de faisabilité',
            'Gain heures/semaine',
            'Gain heures/mois',
            'Gain heures/année',
            'Temps développement (h)',
            'Temps configuration (h)',
            'Coût développement (€)',
            'Économies annuelles (€)',
            'ROI 3 ans (%)',
            'Retour investissement (mois)',
            'Technologies requises'
        ]);

        // Data rows
        analysisData.results.tasks.forEach(task => {
            data.push([
                task.name,
                task.description,
                task.hours,
                task.ai_category.name,
                task.automation_level,
                task.automation_percentage,
                task.feasibility_score,
                task.time_savings_hours_week,
                task.time_savings_hours_month,
                task.time_savings_hours_year,
                task.dev_time_estimate,
                task.user_config_time,
                task.roi_estimate.development_cost_euro,
                task.roi_estimate.yearly_savings_euro,
                task.roi_estimate.roi_3_years_percent,
                task.roi_estimate.payback_months,
                task.required_technologies.join(', ')
            ]);
        });

        return data;
    }

    convertToCSV(data) {
        return data.map(row => 
            row.map(field => {
                // Escape quotes and wrap in quotes if necessary
                const fieldStr = String(field || '');
                if (fieldStr.includes(',') || fieldStr.includes('\"') || fieldStr.includes('\n')) {
                    return '\"' + fieldStr.replace(/\"/g, '\"\"') + '\"';
                }
                return fieldStr;
            }).join(',')
        ).join('\n');
    }

    async shareByEmail() {
        const modal = this.createEmailModal();
        document.body.appendChild(modal);
    }

    createEmailModal() {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-4">
                <h3 class="text-lg font-semibold text-gray-800 mb-4">
                    <i class="fas fa-envelope text-blue-600 mr-2"></i>
                    Partager par Email
                </h3>
                
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Adresses email (séparées par des virgules)</label>
                        <textarea id="emailAddresses" rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                  placeholder="email1@exemple.com, email2@exemple.com"></textarea>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Message personnel (optionnel)</label>
                        <textarea id="personalMessage" rows="2" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                  placeholder="Message d'accompagnement..."></textarea>
                    </div>
                    
                    <div class="flex items-center">
                        <input type="checkbox" id="includeDetails" checked class="mr-2">
                        <label for="includeDetails" class="text-sm text-gray-700">Inclure les détails techniques</label>
                    </div>
                </div>

                <div class="flex space-x-3 mt-6">
                    <button id="sendEmailBtn" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors flex-1">
                        <i class="fas fa-paper-plane mr-2"></i>Envoyer
                    </button>
                    <button id="cancelEmailBtn" class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md font-medium transition-colors flex-1">
                        Annuler
                    </button>
                </div>
            </div>
        `;

        // Event listeners for modal
        modal.querySelector('#sendEmailBtn').addEventListener('click', () => {
            this.sendEmail(modal);
        });
        
        modal.querySelector('#cancelEmailBtn').addEventListener('click', () => {
            modal.remove();
        });

        return modal;
    }

    async sendEmail(modal) {
        const emailAddresses = modal.querySelector('#emailAddresses').value.trim();
        const personalMessage = modal.querySelector('#personalMessage').value.trim();
        const includeDetails = modal.querySelector('#includeDetails').checked;

        if (!emailAddresses) {
            app.showNotification('Veuillez saisir au moins une adresse email', 'warning');
            return;
        }

        try {
            // Prepare email content
            const emailContent = this.prepareEmailContent(personalMessage, includeDetails);
            
            // Simulate email sending (in real app, this would call a backend service)
            await this.simulateEmailSending(emailAddresses, emailContent);
            
            modal.remove();
            app.showNotification('Email envoyé avec succès!', 'success');
            
        } catch (error) {
            console.error('Email sending error:', error);
            app.showNotification('Erreur lors de l\'envoi de l\'email', 'error');
        }
    }

    prepareEmailContent(personalMessage, includeDetails) {
        const data = app.analysisData;
        
        let content = `
Diagnostic d'Automatisation IA - ${data.job.title}

${personalMessage ? personalMessage + '\n\n' : ''}

=== RÉSUMÉ EXÉCUTIF ===
Poste analysé: ${data.job.title}
Secteur: ${data.job.sector}
Nombre de tâches: ${data.results.summary.total_tasks}
Gain hebdomadaire total: ${data.results.summary.total_time_savings_weekly}h
Automatisation moyenne: ${data.results.summary.automation_percentage_average}%
Économies annuelles estimées: ${data.results.summary.financial_impact.yearly_savings_euro}€

=== TÂCHES PRIORITAIRES ===
`;

        const topTasks = data.results.tasks
            .filter(task => task.automation_percentage >= 50)
            .sort((a, b) => b.automation_percentage - a.automation_percentage)
            .slice(0, 5);

        topTasks.forEach((task, index) => {
            content += `
${index + 1}. ${task.name}
   - Automatisation: ${task.automation_percentage}%
   - Gain: ${task.time_savings_hours_week}h/semaine
   - Faisabilité: ${task.feasibility_score}/10
`;
        });

        if (includeDetails) {
            content += `
=== DÉTAILS TECHNIQUES ===
Investissement total estimé: ${data.results.summary.financial_impact.development_investment_euro}€
Retour sur investissement: ${Math.round(data.results.summary.financial_impact.payback_months)} mois
Bénéfice net sur 3 ans: ${data.results.summary.financial_impact.net_benefit_3_years}€
`;
        }

        content += `

Ce rapport a été généré par AutomationImpactAnalyzer.
Date: ${new Date().toLocaleDateString('fr-FR')}
        `;

        return content;
    }

    async simulateEmailSending(emails, content) {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // In a real application, this would send the email through a backend service
        console.log('Email would be sent to:', emails);
        console.log('Content:', content);
        
        // Save email record
        try {
            await fetch('tables/reports', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    analysis_id: app.analysisData.analysis_id || 'current',
                    report_type: 'executive',
                    generated_date: new Date().toISOString(),
                    report_data: JSON.stringify({ email_content: content }),
                    shared_with_emails: emails.split(',').map(e => e.trim()),
                    export_count: 1,
                    is_archived: false
                })
            });
        } catch (error) {
            console.error('Error saving email record:', error);
        }
    }

    async saveAnalysis() {
        if (!app || !app.analysisData || !app.analysisData.results) {
            app.showNotification('Aucune analyse à sauvegarder. Veuillez d\'abord effectuer une analyse.', 'warning');
            return;
        }

        try {
            // Generate unique analysis ID
            const analysisId = `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            app.analysisData.analysis_id = analysisId;

            // Save job analysis
            const jobAnalysisData = {
                id: analysisId,
                user_id: 'anonymous_user', // In real app, this would be the actual user ID
                job_title: app.analysisData.job.title,
                company_sector: app.analysisData.job.sector,
                job_description: app.analysisData.job.description,
                total_hours_per_week: app.analysisData.job.totalHours,
                analysis_status: 'completed',
                automation_score: Math.round(app.analysisData.results.summary.automation_percentage_average / 10),
                total_time_savings_hours_week: app.analysisData.results.summary.total_time_savings_weekly,
                analysis_date: new Date().toISOString()
            };

            await fetch('tables/job_analyses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(jobAnalysisData)
            });

            // Save individual tasks
            for (const task of app.analysisData.results.tasks) {
                const taskData = {
                    analysis_id: analysisId,
                    task_name: task.name,
                    task_description: task.description,
                    hours_per_week: task.hours,
                    automation_level: task.automation_level,
                    feasibility_score: task.feasibility_score,
                    automation_percentage: task.automation_percentage,
                    time_savings_hours_week: task.time_savings_hours_week,
                    dev_time_estimate: task.dev_time_estimate,
                    user_config_time: task.user_config_time,
                    ai_category: task.ai_category.name,
                    complexity_factors: JSON.stringify(task.complexity_assessment),
                    required_data_types: task.required_technologies
                };

                await fetch('tables/tasks', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(taskData)
                });
            }

            // Save report record
            await fetch('tables/reports', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    analysis_id: analysisId,
                    report_type: 'detailed',
                    generated_date: new Date().toISOString(),
                    report_data: JSON.stringify(app.analysisData.results),
                    shared_with_emails: [],
                    export_count: 0,
                    is_archived: false
                })
            });

            // Store in localStorage for quick access
            const savedAnalyses = JSON.parse(localStorage.getItem('saved_analyses') || '[]');
            savedAnalyses.push({
                id: analysisId,
                title: app.analysisData.job.title,
                date: new Date().toISOString(),
                summary: {
                    tasks: app.analysisData.results.summary.total_tasks,
                    savings: app.analysisData.results.summary.total_time_savings_weekly,
                    automation: app.analysisData.results.summary.automation_percentage_average
                }
            });
            
            // Keep only last 10 analyses
            if (savedAnalyses.length > 10) {
                savedAnalyses.splice(0, savedAnalyses.length - 10);
            }
            
            localStorage.setItem('saved_analyses', JSON.stringify(savedAnalyses));

            app.showNotification('Analyse sauvegardée avec succès!', 'success');
            
        } catch (error) {
            console.error('Save analysis error:', error);
            app.showNotification('Erreur lors de la sauvegarde', 'error');
        }
    }

    filterTasks(filter) {
        const taskCards = document.querySelectorAll('.task-detail-card');
        
        taskCards.forEach(card => {
            if (filter === 'all') {
                card.style.display = 'block';
            } else {
                const automationLevel = card.dataset.automationLevel;
                card.style.display = automationLevel === filter ? 'block' : 'none';
            }
        });
    }

    updateFilterButtons(activeButton) {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active', 'bg-blue-600', 'text-white');
            btn.classList.add('bg-gray-200', 'text-gray-700');
        });
        
        activeButton.classList.add('active', 'bg-blue-600', 'text-white');
        activeButton.classList.remove('bg-gray-200', 'text-gray-700');
    }
}

// Initialize export manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ExportManager();
});