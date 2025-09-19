// AutomationImpactAnalyzer - Internationalization Manager
class I18nManager {
    constructor() {
        this.currentLanguage = 'fr';
        this.translations = this.loadTranslations();
        this.rtlLanguages = ['ar', 'he'];
        this.init();
    }

    init() {
        this.currentLanguage = localStorage.getItem('app_language') || 'fr';
        this.setupLanguageSelector();
        this.applyTranslations();
        this.setupRTLSupport();
    }

    loadTranslations() {
        return {
            fr: {
                // Navigation
                appTitle: "AutomationImpactAnalyzer",
                export: "Exporter",
                
                // Steps
                step1Title: "Informations sur votre poste",
                step2Title: "Détail de vos tâches",
                step3Title: "Résultats de l'analyse",
                stepProgress: "Étape {current} sur {total}",
                
                // Form labels
                jobTitle: "Intitulé du poste",
                jobTitlePlaceholder: "Ex: Analyste Marketing Digital",
                companySector: "Secteur d'activité",
                selectSector: "Sélectionnez un secteur",
                jobDescription: "Description du poste",
                jobDescriptionPlaceholder: "Décrivez brièvement vos principales responsabilités et missions...",
                weeklyHours: "Heures de travail par semaine",
                company: "Entreprise (optionnel)",
                companyPlaceholder: "Nom de votre entreprise",
                
                // Sectors
                technology: "Technologie",
                finance: "Finance",
                healthcare: "Santé",
                education: "Éducation",
                marketing: "Marketing",
                humanResources: "Ressources Humaines",
                manufacturing: "Manufacturing",
                retail: "Commerce de détail",
                other: "Autre",
                
                // Tasks
                taskName: "Nom de la tâche",
                taskNamePlaceholder: "Ex: Rédaction de rapports mensuels",
                taskDescription: "Description détaillée",
                taskDescriptionPlaceholder: "Décrivez précisément cette tâche, les outils utilisés, les étapes...",
                hoursPerWeek: "Heures/semaine",
                addTask: "Ajouter une tâche",
                removeTask: "Supprimer la tâche",
                taskInfo: "Listez toutes vos tâches principales avec le temps approximatif consacré à chacune par semaine.",
                
                // Buttons
                next: "Suivant",
                previous: "Précédent",
                analyzeWithAI: "Analyser avec l'IA",
                
                // Analysis
                analyzing: "Analyse en cours...",
                aiAnalyzing: "Notre IA analyse vos tâches",
                
                // Results
                executiveSummary: "Résumé Exécutif",
                overallAutomationScore: "Score Global d'Automatisation",
                tasksAnalyzed: "Tâches analysées",
                weeklyGain: "Gain hebdomadaire",
                averageAutomation: "Automatisation moyenne",
                annualSavings: "Économies annuelles",
                
                automationLevels: {
                    high: "Élevé (≥70%)",
                    medium: "Moyen (40-69%)",
                    low: "Faible (<40%)"
                },
                
                financialAnalysis: "Analyse Financière",
                initialInvestment: "Investissement initial :",
                annualSavingsLabel: "Économies annuelles :",
                roi: "Retour sur investissement :",
                netBenefit3Years: "Bénéfice net (3 ans) :",
                months: "mois",
                
                contextualAnalysis: "Analyse Contextuelle",
                
                // Charts
                interactiveVisualizations: "Visualisations Interactives",
                automationPotentialByTask: "Potentiel d'Automatisation par Tâche (%)",
                timeSavingsByTask: "Gains de Temps par Tâche",
                technicalFeasibilityByTask: "Faisabilité Technique par Tâche",
                currentTimeWeek: "Temps actuel (h/sem)",
                timeSavedWeek: "Temps économisé (h/sem)",
                feasibilityScore: "Score de Faisabilité (1-10)",
                hoursPerWeekLabel: "Heures par semaine",
                
                highFeasibilityTasks: "Tâches haute faisabilité (≥7)",
                highAutomationTasks: "Tâches forte automatisation (≥70%)",
                totalWeeklyGains: "Total gains hebdomadaires",
                
                // Task Details
                detailedTaskAnalysis: "Analyse Détaillée des Tâches",
                allTasks: "Toutes les tâches",
                highAutomation: "Automatisation élevée",
                mediumAutomation: "Automatisation moyenne",
                lowAutomation: "Automatisation faible",
                
                automatable: "automatisable",
                feasibility: "Faisabilité",
                currentTime: "Temps actuel",
                timeSaved: "Temps économisé",
                development: "Développement",
                configuration: "Configuration",
                
                recommendedTechnologies: "Technologies Recommandées",
                implementationPhases: "Phases d'Implémentation",
                estimatedROI: "ROI Estimé",
                developmentCost: "Coût développement",
                riskFactors: "Facteurs de Risque",
                
                // Recommendations
                strategicRecommendations: "Recommandations Stratégiques",
                priorityActions: "Actions Prioritaires",
                longTermOptimizations: "Optimisations Long Terme",
                aiAdoptionStrategy: "Stratégie d'Adoption de l'IA",
                
                phases: {
                    phase1: "Phase 1",
                    phase2: "Phase 2",
                    phase3: "Phase 3",
                    quickWins: "Automatisation Quick Wins<br>(0-6 mois)",
                    processOptimization: "Optimisation Processus<br>(6-12 mois)",
                    digitalTransformation: "Transformation Digitale<br>(12+ mois)"
                },
                
                impact: "Impact",
                timeline: "Horizon",
                
                // Action Plan
                detailedActionPlan: "Plan d'Action Détaillé",
                estimatedDuration: "Durée estimée",
                estimatedCost: "Coût estimé",
                expectedGain: "Gain attendu",
                complexity: "Complexité",
                keySteps: "Étapes Clés",
                requiredResources: "Ressources Nécessaires",
                
                priority: {
                    high: "Élevée",
                    medium: "Moyenne",
                    low: "Faible"
                },
                
                // Export
                exportAndShare: "Export et Partage",
                exportPDF: "Export PDF",
                fullReport: "Rapport complet",
                exportExcel: "Export Excel",
                detailedData: "Données détaillées",
                shareByEmail: "Partager par Email",
                sendReport: "Envoyer le rapport",
                save: "Sauvegarder",
                laterConsultation: "Pour consultation ultérieure",
                
                confidentiality: "Confidentialité",
                confidentialityText: "Toutes vos données sont anonymisées et chiffrées. Les exports ne contiennent aucune information personnelle identifiable.",
                
                // RGPD
                dataProtection: "Protection des données",
                rgpdText: "Nous respectons votre vie privée. Vos données sont anonymisées et utilisées uniquement pour l'analyse. Elles ne sont jamais partagées avec des tiers.",
                accept: "J'accepte",
                decline: "Refuser",
                
                // Email sharing
                shareByEmailTitle: "Partager par Email",
                emailAddresses: "Adresses email (séparées par des virgules)",
                emailPlaceholder: "email1@exemple.com, email2@exemple.com",
                personalMessage: "Message personnel (optionnel)",
                messagePlaceholder: "Message d'accompagnement...",
                includeTechnicalDetails: "Inclure les détails techniques",
                send: "Envoyer",
                cancel: "Annuler",
                
                // Notifications
                fillRequiredFields: "Veuillez remplir tous les champs obligatoires",
                addAtLeastOneTask: "Veuillez ajouter au moins une tâche",
                taskHoursExceedTotal: "La somme des heures des tâches ({taskHours}h) dépasse significativement vos heures de travail totales ({totalHours}h)",
                analysisError: "Erreur lors de l'analyse. Veuillez réessayer.",
                noAnalysisToExport: "Aucune analyse à exporter. Veuillez d'abord effectuer une analyse.",
                pdfGeneratedSuccess: "Rapport PDF généré avec succès!",
                pdfGenerationError: "Erreur lors de la génération du PDF",
                excelGeneratedSuccess: "Export Excel généré avec succès!",
                excelGenerationError: "Erreur lors de l'export Excel",
                enterEmailAddress: "Veuillez saisir au moins une adresse email",
                emailSentSuccess: "Email envoyé avec succès!",
                emailSendingError: "Erreur lors de l'envoi de l'email",
                analysisSavedSuccess: "Analyse sauvegardée avec succès!",
                analysisSaveError: "Erreur lors de la sauvegarde",
                rgpdAcceptRequired: "Vous devez accepter les conditions de protection des données pour utiliser cette application."
            },
            
            en: {
                // Navigation
                appTitle: "AutomationImpactAnalyzer",
                export: "Export",
                
                // Steps
                step1Title: "Job Information",
                step2Title: "Task Details",
                step3Title: "Analysis Results",
                stepProgress: "Step {current} of {total}",
                
                // Form labels
                jobTitle: "Job Title",
                jobTitlePlaceholder: "E.g.: Digital Marketing Analyst",
                companySector: "Industry Sector",
                selectSector: "Select a sector",
                jobDescription: "Job Description",
                jobDescriptionPlaceholder: "Briefly describe your main responsibilities and missions...",
                weeklyHours: "Weekly working hours",
                company: "Company (optional)",
                companyPlaceholder: "Your company name",
                
                // Sectors
                technology: "Technology",
                finance: "Finance",
                healthcare: "Healthcare",
                education: "Education",
                marketing: "Marketing",
                humanResources: "Human Resources",
                manufacturing: "Manufacturing",
                retail: "Retail",
                other: "Other",
                
                // Tasks
                taskName: "Task Name",
                taskNamePlaceholder: "E.g.: Monthly report writing",
                taskDescription: "Detailed Description",
                taskDescriptionPlaceholder: "Describe precisely this task, tools used, steps...",
                hoursPerWeek: "Hours/week",
                addTask: "Add Task",
                removeTask: "Remove Task",
                taskInfo: "List all your main tasks with approximate time spent on each per week.",
                
                // Buttons
                next: "Next",
                previous: "Previous",
                analyzeWithAI: "Analyze with AI",
                
                // Analysis
                analyzing: "Analyzing...",
                aiAnalyzing: "Our AI is analyzing your tasks",
                
                // Results
                executiveSummary: "Executive Summary",
                overallAutomationScore: "Overall Automation Score",
                tasksAnalyzed: "Tasks analyzed",
                weeklyGain: "Weekly gain",
                averageAutomation: "Average automation",
                annualSavings: "Annual savings",
                
                automationLevels: {
                    high: "High (≥70%)",
                    medium: "Medium (40-69%)",
                    low: "Low (<40%)"
                },
                
                financialAnalysis: "Financial Analysis",
                initialInvestment: "Initial investment:",
                annualSavingsLabel: "Annual savings:",
                roi: "Return on investment:",
                netBenefit3Years: "Net benefit (3 years):",
                months: "months",
                
                contextualAnalysis: "Contextual Analysis",
                
                // Add other English translations...
                // (truncated for brevity, but would include all translations)
            },
            
            es: {
                // Spanish translations
                appTitle: "AutomationImpactAnalyzer",
                export: "Exportar",
                step1Title: "Información del Puesto",
                step2Title: "Detalles de Tareas",
                step3Title: "Resultados del Análisis",
                // ... more Spanish translations
            },
            
            de: {
                // German translations
                appTitle: "AutomationImpactAnalyzer",
                export: "Exportieren",
                step1Title: "Stelleninformationen",
                step2Title: "Aufgabendetails",
                step3Title: "Analyseergebnisse",
                // ... more German translations
            }
        };
    }

    setupLanguageSelector() {
        const languageSelect = document.getElementById('languageSelect');
        if (languageSelect) {
            languageSelect.value = this.currentLanguage;
            languageSelect.addEventListener('change', (e) => {
                this.changeLanguage(e.target.value);
            });
        }
    }

    changeLanguage(languageCode) {
        if (this.translations[languageCode]) {
            this.currentLanguage = languageCode;
            localStorage.setItem('app_language', languageCode);
            this.applyTranslations();
            this.setupRTLSupport();
            
            // Notify app of language change
            if (window.app) {
                window.app.currentLanguage = languageCode;
            }
        }
    }

    applyTranslations() {
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.getTranslation(key);
            if (translation) {
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = translation;
                } else {
                    element.innerHTML = translation;
                }
            }
        });

        // Update page title
        const titleTranslation = this.getTranslation('appTitle');
        if (titleTranslation) {
            document.title = `${titleTranslation} - Diagnostic d'Automatisation IA`;
        }
    }

    getTranslation(key, params = {}) {
        const keys = key.split('.');
        let translation = this.translations[this.currentLanguage];
        
        for (const k of keys) {
            if (translation && typeof translation === 'object' && k in translation) {
                translation = translation[k];
            } else {
                // Fallback to French if translation not found
                translation = this.translations['fr'];
                for (const fallbackKey of keys) {
                    if (translation && typeof translation === 'object' && fallbackKey in translation) {
                        translation = translation[fallbackKey];
                    } else {
                        return key; // Return key if no translation found
                    }
                }
                break;
            }
        }

        // Replace parameters in translation
        if (typeof translation === 'string' && Object.keys(params).length > 0) {
            Object.keys(params).forEach(param => {
                translation = translation.replace(`{${param}}`, params[param]);
            });
        }

        return translation || key;
    }

    setupRTLSupport() {
        const isRTL = this.rtlLanguages.includes(this.currentLanguage);
        document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
        document.documentElement.lang = this.currentLanguage;
        
        if (isRTL) {
            document.body.classList.add('rtl');
        } else {
            document.body.classList.remove('rtl');
        }
    }

    formatNumber(number, options = {}) {
        return new Intl.NumberFormat(this.getLocale(), options).format(number);
    }

    formatCurrency(amount, currency = 'EUR') {
        return new Intl.NumberFormat(this.getLocale(), {
            style: 'currency',
            currency: currency,
            maximumFractionDigits: 0
        }).format(amount);
    }

    formatDate(date, options = {}) {
        const defaultOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        return new Intl.DateTimeFormat(this.getLocale(), {...defaultOptions, ...options}).format(new Date(date));
    }

    getLocale() {
        const localeMap = {
            'fr': 'fr-FR',
            'en': 'en-US',
            'es': 'es-ES',
            'de': 'de-DE'
        };
        return localeMap[this.currentLanguage] || 'fr-FR';
    }

    // Dynamic content translation methods
    translateContent(content, params = {}) {
        return this.getTranslation(content, params);
    }

    translateAutomationLevel(level) {
        const levelMap = {
            'eleve': 'automationLevels.high',
            'moyen': 'automationLevels.medium',
            'faible': 'automationLevels.low'
        };
        return this.getTranslation(levelMap[level] || level);
    }

    translateSector(sectorKey) {
        const sectorMap = {
            'technologie': 'technology',
            'finance': 'finance',
            'sante': 'healthcare',
            'education': 'education',
            'marketing': 'marketing',
            'ressources-humaines': 'humanResources',
            'manufacturing': 'manufacturing',
            'retail': 'retail',
            'autre': 'other'
        };
        return this.getTranslation(sectorMap[sectorKey] || 'other');
    }

    translatePriority(priority) {
        const priorityMap = {
            'élevée': 'priority.high',
            'moyenne': 'priority.medium',
            'faible': 'priority.low',
            'high': 'priority.high',
            'medium': 'priority.medium',
            'low': 'priority.low'
        };
        return this.getTranslation(priorityMap[priority.toLowerCase()] || priority);
    }
}

// Initialize internationalization
let i18nManager;
document.addEventListener('DOMContentLoaded', () => {
    i18nManager = new I18nManager();
    window.i18n = i18nManager; // Make it globally accessible
});