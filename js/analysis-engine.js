// AutomationImpactAnalyzer - AI Analysis Engine
class AnalysisEngine {
    constructor() {
        this.aiCategories = {
            'data_processing': {
                name: 'Traitement de données',
                technologies: ['Machine Learning', 'ETL automatisé', 'Analytics AI'],
                typical_feasibility: 8,
                typical_automation: 75
            },
            'document_processing': {
                name: 'Traitement de documents',
                technologies: ['OCR', 'NLP', 'Document AI'],
                typical_feasibility: 7,
                typical_automation: 65
            },
            'communication': {
                name: 'Communication',
                technologies: ['Chatbots', 'Email automation', 'NLG'],
                typical_feasibility: 6,
                typical_automation: 50
            },
            'analysis_reporting': {
                name: 'Analyse et reporting',
                technologies: ['Business Intelligence', 'Automated reporting', 'Data viz'],
                typical_feasibility: 9,
                typical_automation: 80
            },
            'content_creation': {
                name: 'Création de contenu',
                technologies: ['GPT/LLM', 'Content generation', 'Template automation'],
                typical_feasibility: 7,
                typical_automation: 60
            },
            'scheduling_planning': {
                name: 'Planification',
                technologies: ['Algorithmes d\'optimisation', 'Calendar AI', 'Resource planning'],
                typical_feasibility: 8,
                typical_automation: 70
            },
            'quality_control': {
                name: 'Contrôle qualité',
                technologies: ['Computer Vision', 'Pattern recognition', 'Anomaly detection'],
                typical_feasibility: 7,
                typical_automation: 65
            },
            'customer_service': {
                name: 'Service client',
                technologies: ['Conversational AI', 'Sentiment analysis', 'Ticket routing'],
                typical_feasibility: 8,
                typical_automation: 75
            },
            'research_monitoring': {
                name: 'Recherche et veille',
                technologies: ['Web scraping', 'Information extraction', 'Trend analysis'],
                typical_feasibility: 6,
                typical_automation: 55
            },
            'administrative': {
                name: 'Tâches administratives',
                technologies: ['RPA', 'Workflow automation', 'Form processing'],
                typical_feasibility: 9,
                typical_automation: 85
            }
        };

        this.complexityFactors = {
            'data_availability': {
                name: 'Disponibilité des données',
                impact: 0.3,
                levels: {
                    'high': { score: 1, description: 'Données structurées et accessibles' },
                    'medium': { score: 0.6, description: 'Données partiellement structurées' },
                    'low': { score: 0.3, description: 'Données non structurées ou difficiles d\'accès' }
                }
            },
            'process_standardization': {
                name: 'Standardisation du processus',
                impact: 0.25,
                levels: {
                    'high': { score: 1, description: 'Processus très standardisé et répétitif' },
                    'medium': { score: 0.6, description: 'Processus partiellement standardisé' },
                    'low': { score: 0.3, description: 'Processus créatif ou très variable' }
                }
            },
            'technology_maturity': {
                name: 'Maturité technologique',
                impact: 0.2,
                levels: {
                    'high': { score: 1, description: 'Technologies IA très matures' },
                    'medium': { score: 0.7, description: 'Technologies émergentes' },
                    'low': { score: 0.4, description: 'Technologies expérimentales' }
                }
            },
            'integration_complexity': {
                name: 'Complexité d\'intégration',
                impact: 0.15,
                levels: {
                    'high': { score: 0.3, description: 'Intégration très complexe' },
                    'medium': { score: 0.6, description: 'Intégration modérée' },
                    'low': { score: 1, description: 'Intégration simple' }
                }
            },
            'human_judgment': {
                name: 'Besoin de jugement humain',
                impact: 0.1,
                levels: {
                    'high': { score: 0.2, description: 'Décisions critiques nécessaires' },
                    'medium': { score: 0.5, description: 'Supervision humaine requise' },
                    'low': { score: 1, description: 'Peu de supervision nécessaire' }
                }
            }
        };

        this.sectorMultipliers = {
            'technologie': 1.2,
            'finance': 1.0,
            'sante': 0.8,
            'education': 0.7,
            'marketing': 1.1,
            'ressources-humaines': 1.0,
            'manufacturing': 0.9,
            'retail': 0.9,
            'autre': 0.8
        };
    }

    async analyzeTasks(jobInfo, tasks) {
        const results = {
            job_info: jobInfo,
            analysis_date: new Date().toISOString(),
            tasks: [],
            summary: {}
        };

        // Analyze each task individually
        for (const task of tasks) {
            const taskAnalysis = await this.analyzeTask(task, jobInfo);
            results.tasks.push(taskAnalysis);
        }

        // Generate summary metrics
        results.summary = this.generateSummary(results.tasks, jobInfo);

        return results;
    }

    async analyzeTask(task, jobInfo) {
        // Step 1: Classify task into AI category
        const aiCategory = this.classifyTask(task);
        
        // Step 2: Assess complexity factors
        const complexityAssessment = this.assessComplexity(task, aiCategory);
        
        // Step 3: Calculate automation potential
        const automationPotential = this.calculateAutomationPotential(
            task, 
            aiCategory, 
            complexityAssessment, 
            jobInfo.sector
        );
        
        // Step 4: Estimate development effort
        const developmentEstimate = this.estimateDevelopmentEffort(
            task,
            aiCategory,
            complexityAssessment,
            automationPotential
        );

        // Step 5: Calculate time savings
        const timeSavings = this.calculateTimeSavings(task, automationPotential);

        return {
            ...task,
            ai_category: aiCategory,
            complexity_assessment: complexityAssessment,
            automation_level: this.getAutomationLevel(automationPotential.automation_percentage),
            automation_percentage: automationPotential.automation_percentage,
            feasibility_score: automationPotential.feasibility_score,
            time_savings_hours_week: timeSavings.weekly,
            time_savings_hours_month: timeSavings.monthly,
            time_savings_hours_year: timeSavings.yearly,
            dev_time_estimate: developmentEstimate.development_hours,
            user_config_time: developmentEstimate.user_config_hours,
            implementation_phases: developmentEstimate.phases,
            required_technologies: aiCategory.technologies,
            risk_factors: this.identifyRiskFactors(task, complexityAssessment),
            roi_estimate: this.calculateROI(timeSavings, developmentEstimate)
        };
    }

    classifyTask(task) {
        const taskText = `${task.name} ${task.description}`.toLowerCase();
        
        // Keywords mapping to AI categories
        const categoryKeywords = {
            'data_processing': [
                'données', 'data', 'analyse', 'traitement', 'excel', 'csv', 'base de données',
                'statistiques', 'calculs', 'agrégation', 'transformation', 'nettoyage'
            ],
            'document_processing': [
                'document', 'pdf', 'scan', 'lecture', 'extraction', 'formulaire', 'contrat',
                'facture', 'classement', 'archivage', 'numérisation', 'ocr'
            ],
            'communication': [
                'email', 'courrier', 'réponse', 'communication', 'message', 'contact',
                'client', 'fournisseur', 'appel', 'téléphone', 'chat', 'notification'
            ],
            'analysis_reporting': [
                'rapport', 'reporting', 'dashboard', 'tableau de bord', 'indicateur',
                'kpi', 'métriques', 'performance', 'suivi', 'monitoring', 'visualisation'
            ],
            'content_creation': [
                'rédaction', 'écriture', 'contenu', 'article', 'post', 'publication',
                'création', 'design', 'présentation', 'template', 'modèle'
            ],
            'scheduling_planning': [
                'planification', 'planning', 'calendrier', 'organisation', 'rendez-vous',
                'réunion', 'agenda', 'horaire', 'allocation', 'ressources', 'scheduling'
            ],
            'quality_control': [
                'contrôle', 'vérification', 'validation', 'qualité', 'audit', 'inspection',
                'conformité', 'test', 'review', 'approbation', 'correction'
            ],
            'customer_service': [
                'service client', 'support', 'réclamation', 'ticket', 'assistance',
                'help desk', 'satisfaction', 'feedback', 'relation client'
            ],
            'research_monitoring': [
                'recherche', 'veille', 'benchmark', 'étude', 'investigation', 'analyse concurrentielle',
                'market research', 'intelligence', 'monitoring', 'surveillance'
            ],
            'administrative': [
                'saisie', 'administration', 'gestion', 'suivi administratif', 'procédure',
                'workflow', 'processus', 'routine', 'tâches répétitives', 'bureaucratie'
            ]
        };

        let bestCategory = 'administrative';
        let maxScore = 0;

        Object.entries(categoryKeywords).forEach(([category, keywords]) => {
            let score = 0;
            keywords.forEach(keyword => {
                if (taskText.includes(keyword)) {
                    score += 1;
                }
            });
            
            if (score > maxScore) {
                maxScore = score;
                bestCategory = category;
            }
        });

        return this.aiCategories[bestCategory];
    }

    assessComplexity(task, aiCategory) {
        const assessment = {};
        
        // Evaluate each complexity factor based on task description
        Object.entries(this.complexityFactors).forEach(([factorKey, factor]) => {
            assessment[factorKey] = this.evaluateComplexityFactor(task, factorKey, factor);
        });

        return assessment;
    }

    evaluateComplexityFactor(task, factorKey, factor) {
        const taskText = `${task.name} ${task.description}`.toLowerCase();
        
        // Simplified heuristic-based evaluation
        switch (factorKey) {
            case 'data_availability':
                if (taskText.includes('excel') || taskText.includes('csv') || taskText.includes('base de données')) {
                    return factor.levels.high;
                } else if (taskText.includes('document') || taskText.includes('email')) {
                    return factor.levels.medium;
                } else {
                    return factor.levels.low;
                }
                
            case 'process_standardization':
                if (taskText.includes('routine') || taskText.includes('répétitif') || taskText.includes('standard')) {
                    return factor.levels.high;
                } else if (taskText.includes('analyse') || taskText.includes('rapport')) {
                    return factor.levels.medium;
                } else {
                    return factor.levels.low;
                }
                
            case 'technology_maturity':
                if (taskText.includes('données') || taskText.includes('document') || taskText.includes('email')) {
                    return factor.levels.high;
                } else if (taskText.includes('analyse') || taskText.includes('communication')) {
                    return factor.levels.medium;
                } else {
                    return factor.levels.low;
                }
                
            case 'integration_complexity':
                if (taskText.includes('simple') || taskText.includes('standalone')) {
                    return factor.levels.low;
                } else if (taskText.includes('système') || taskText.includes('intégration')) {
                    return factor.levels.high;
                } else {
                    return factor.levels.medium;
                }
                
            case 'human_judgment':
                if (taskText.includes('créatif') || taskText.includes('stratégique') || taskText.includes('décision')) {
                    return factor.levels.high;
                } else if (taskText.includes('validation') || taskText.includes('contrôle')) {
                    return factor.levels.medium;
                } else {
                    return factor.levels.low;
                }
                
            default:
                return factor.levels.medium;
        }
    }

    calculateAutomationPotential(task, aiCategory, complexityAssessment, sector) {
        // Base automation potential from AI category
        let baseAutomation = aiCategory.typical_automation;
        let baseFeasibility = aiCategory.typical_feasibility;
        
        // Apply complexity factors
        let complexityMultiplier = 1.0;
        Object.entries(complexityAssessment).forEach(([factorKey, assessment]) => {
            const factor = this.complexityFactors[factorKey];
            complexityMultiplier *= (assessment.score * factor.impact + (1 - factor.impact));
        });
        
        // Apply sector multiplier
        const sectorMultiplier = this.sectorMultipliers[sector] || 0.8;
        
        // Calculate final scores
        const automation_percentage = Math.min(95, Math.max(5, 
            baseAutomation * complexityMultiplier * sectorMultiplier
        ));
        
        const feasibility_score = Math.min(10, Math.max(1, 
            baseFeasibility * complexityMultiplier * sectorMultiplier
        ));
        
        return {
            automation_percentage: Math.round(automation_percentage),
            feasibility_score: Math.round(feasibility_score * 10) / 10
        };
    }

    getAutomationLevel(percentage) {
        if (percentage >= 70) return 'eleve';
        if (percentage >= 40) return 'moyen';
        return 'faible';
    }

    estimateDevelopmentEffort(task, aiCategory, complexityAssessment, automationPotential) {
        // Base development time from AI category and complexity
        let baseDevelopmentHours = 40; // Default base
        
        // Adjust based on AI category
        const categoryMultipliers = {
            'administrative': 0.5,
            'data_processing': 1.0,
            'document_processing': 1.2,
            'analysis_reporting': 0.8,
            'communication': 1.5,
            'content_creation': 1.3,
            'scheduling_planning': 1.0,
            'quality_control': 1.4,
            'customer_service': 1.6,
            'research_monitoring': 1.1
        };
        
        const categoryKey = Object.keys(this.aiCategories).find(key => 
            this.aiCategories[key].name === aiCategory.name
        );
        
        baseDevelopmentHours *= (categoryMultipliers[categoryKey] || 1.0);
        
        // Apply complexity multiplier
        let complexityMultiplier = 1.0;
        Object.entries(complexityAssessment).forEach(([factorKey, assessment]) => {
            if (assessment.score < 0.5) {
                complexityMultiplier *= 1.5; // More complex = more development time
            }
        });
        
        // Apply feasibility impact
        const feasibilityMultiplier = automationPotential.feasibility_score < 5 ? 1.5 : 1.0;
        
        const development_hours = Math.round(baseDevelopmentHours * complexityMultiplier * feasibilityMultiplier);
        const user_config_hours = Math.round(development_hours * 0.15); // 15% of dev time for configuration
        
        // Define implementation phases
        const phases = [
            {
                name: 'Analyse et conception',
                duration: Math.round(development_hours * 0.2),
                description: 'Analyse des besoins et conception de la solution'
            },
            {
                name: 'Développement',
                duration: Math.round(development_hours * 0.5),
                description: 'Développement et entraînement des modèles IA'
            },
            {
                name: 'Tests et intégration',
                duration: Math.round(development_hours * 0.2),
                description: 'Tests, validation et intégration système'
            },
            {
                name: 'Déploiement et formation',
                duration: Math.round(development_hours * 0.1),
                description: 'Mise en production et formation utilisateur'
            }
        ];
        
        return {
            development_hours,
            user_config_hours,
            phases
        };
    }

    calculateTimeSavings(task, automationPotential) {
        const weeklyHours = task.hours;
        const automationRate = automationPotential.automation_percentage / 100;
        
        const weeklySavings = weeklyHours * automationRate;
        
        return {
            weekly: Math.round(weeklySavings * 10) / 10,
            monthly: Math.round(weeklySavings * 4.33 * 10) / 10,
            yearly: Math.round(weeklySavings * 52 * 10) / 10
        };
    }

    identifyRiskFactors(task, complexityAssessment) {
        const risks = [];
        
        Object.entries(complexityAssessment).forEach(([factorKey, assessment]) => {
            if (assessment.score < 0.5) {
                risks.push({
                    factor: this.complexityFactors[factorKey].name,
                    level: 'high',
                    description: assessment.description,
                    mitigation: this.getRiskMitigation(factorKey)
                });
            } else if (assessment.score < 0.7) {
                risks.push({
                    factor: this.complexityFactors[factorKey].name,
                    level: 'medium',
                    description: assessment.description,
                    mitigation: this.getRiskMitigation(factorKey)
                });
            }
        });
        
        return risks;
    }

    getRiskMitigation(factorKey) {
        const mitigations = {
            'data_availability': 'Structurer et centraliser les données avant l\'automatisation',
            'process_standardization': 'Standardiser les processus métier en amont',
            'technology_maturity': 'Commencer par un pilote ou utiliser des technologies plus matures',
            'integration_complexity': 'Prévoir une phase d\'intégration dédiée avec les équipes IT',
            'human_judgment': 'Maintenir une supervision humaine et des points de validation'
        };
        
        return mitigations[factorKey] || 'Analyse approfondie recommandée';
    }

    calculateROI(timeSavings, developmentEstimate) {
        // Simplified ROI calculation
        const hourlyCost = 50; // Assume 50€/hour average cost
        const yearlySavings = timeSavings.yearly * hourlyCost;
        const developmentCost = developmentEstimate.development_hours * 80; // 80€/hour for development
        
        const paybackMonths = developmentCost / (yearlySavings / 12);
        const roi3Years = ((yearlySavings * 3 - developmentCost) / developmentCost) * 100;
        
        return {
            yearly_savings_euro: Math.round(yearlySavings),
            development_cost_euro: Math.round(developmentCost),
            payback_months: Math.round(paybackMonths * 10) / 10,
            roi_3_years_percent: Math.round(roi3Years)
        };
    }

    generateSummary(taskAnalyses, jobInfo) {
        const totalTasks = taskAnalyses.length;
        const totalCurrentHours = taskAnalyses.reduce((sum, task) => sum + task.hours, 0);
        const totalTimeSavingsWeekly = taskAnalyses.reduce((sum, task) => sum + task.time_savings_hours_week, 0);
        const totalTimeSavingsYearly = taskAnalyses.reduce((sum, task) => sum + task.time_savings_hours_year, 0);
        
        const averageFeasibility = taskAnalyses.reduce((sum, task) => sum + task.feasibility_score, 0) / totalTasks;
        const averageAutomation = taskAnalyses.reduce((sum, task) => sum + task.automation_percentage, 0) / totalTasks;
        
        const highAutomationTasks = taskAnalyses.filter(task => task.automation_level === 'eleve').length;
        const mediumAutomationTasks = taskAnalyses.filter(task => task.automation_level === 'moyen').length;
        const lowAutomationTasks = taskAnalyses.filter(task => task.automation_level === 'faible').length;
        
        const totalDevelopmentHours = taskAnalyses.reduce((sum, task) => sum + task.dev_time_estimate, 0);
        const totalDevelopmentCost = taskAnalyses.reduce((sum, task) => sum + task.roi_estimate.development_cost_euro, 0);
        const totalYearlySavings = taskAnalyses.reduce((sum, task) => sum + task.roi_estimate.yearly_savings_euro, 0);
        
        return {
            total_tasks: totalTasks,
            total_current_hours_weekly: Math.round(totalCurrentHours * 10) / 10,
            total_time_savings_weekly: Math.round(totalTimeSavingsWeekly * 10) / 10,
            total_time_savings_yearly: Math.round(totalTimeSavingsYearly * 10) / 10,
            automation_percentage_average: Math.round(averageAutomation),
            feasibility_score_average: Math.round(averageFeasibility * 10) / 10,
            automation_distribution: {
                high: highAutomationTasks,
                medium: mediumAutomationTasks,
                low: lowAutomationTasks
            },
            development_summary: {
                total_hours: totalDevelopmentHours,
                total_cost_euro: totalDevelopmentCost,
                estimated_duration_months: Math.round(totalDevelopmentHours / 160) // 160h per month
            },
            financial_impact: {
                yearly_savings_euro: totalYearlySavings,
                development_investment_euro: totalDevelopmentCost,
                net_benefit_3_years: totalYearlySavings * 3 - totalDevelopmentCost,
                payback_months: totalDevelopmentCost / (totalYearlySavings / 12)
            }
        };
    }
}