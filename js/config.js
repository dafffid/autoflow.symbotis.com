// AutomationImpactAnalyzer - Configuration
window.AppConfig = {
    // Application metadata
    app: {
        name: 'AutomationImpactAnalyzer',
        version: '1.0.0',
        description: 'Diagnostic professionnel d\'automatisation par IA',
        author: 'AutomationImpactAnalyzer Team',
        buildDate: '2024-03-15'
    },

    // Feature flags
    features: {
        enableAnalytics: true,
        enablePWA: false,
        enableOfflineMode: false,
        enableBetaFeatures: false,
        enableDebugMode: false,
        enableA11yMode: true,
        enableDarkMode: false
    },

    // API configuration
    api: {
        baseUrl: '', // Relative URLs for static hosting
        timeout: 30000,
        retryAttempts: 3,
        retryDelay: 1000
    },

    // UI Configuration
    ui: {
        defaultLanguage: 'fr',
        supportedLanguages: ['fr', 'en', 'es', 'de'],
        theme: 'light',
        animations: true,
        transitionDuration: 300,
        toastDuration: 5000,
        maxToasts: 3
    },

    // Analysis engine settings
    analysis: {
        maxTasks: 20,
        minTaskHours: 0.5,
        maxTaskHours: 80,
        defaultHoursPerWeek: 40,
        automationThresholds: {
            high: 70,
            medium: 40,
            low: 0
        },
        feasibilityThresholds: {
            high: 7,
            medium: 4,
            low: 1
        }
    },

    // Export settings
    export: {
        pdf: {
            format: 'a4',
            orientation: 'portrait',
            unit: 'mm',
            margins: { top: 20, right: 20, bottom: 20, left: 20 }
        },
        excel: {
            format: 'csv',
            delimiter: ',',
            encoding: 'utf-8'
        },
        email: {
            maxRecipients: 10,
            maxMessageLength: 500
        }
    },

    // Storage configuration
    storage: {
        localStorage: {
            prefix: 'aia_',
            maxAnalyses: 10,
            expirationDays: 30
        },
        sessionStorage: {
            prefix: 'aia_session_'
        }
    },

    // RGPD compliance
    privacy: {
        consentRequired: true,
        dataRetentionDays: 30,
        anonymizeData: true,
        cookieConsentRequired: false,
        trackingEnabled: false
    },

    // Performance settings
    performance: {
        enableLazyLoading: true,
        enableImageOptimization: true,
        enableCodeSplitting: false,
        cacheTimeout: 3600000, // 1 hour
        maxCacheSize: 50 * 1024 * 1024 // 50MB
    },

    // Error handling
    errorHandling: {
        enableErrorReporting: false,
        enableConsoleLogging: true,
        showErrorDetails: false,
        fallbackLanguage: 'fr'
    },

    // Chart.js default configuration
    charts: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    usePointStyle: true,
                    padding: 20
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: '#fff',
                bodyColor: '#fff',
                cornerRadius: 6
            }
        },
        animation: {
            duration: 750,
            easing: 'easeInOutQuart'
        }
    },

    // Validation rules
    validation: {
        jobTitle: {
            minLength: 2,
            maxLength: 100,
            required: true
        },
        jobDescription: {
            minLength: 10,
            maxLength: 1000,
            required: true
        },
        taskName: {
            minLength: 3,
            maxLength: 100,
            required: true
        },
        taskDescription: {
            minLength: 10,
            maxLength: 500,
            required: true
        },
        email: {
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            maxLength: 255
        }
    },

    // Accessibility settings
    accessibility: {
        enableKeyboardNavigation: true,
        enableScreenReader: true,
        enableHighContrast: false,
        enableReducedMotion: true,
        focusOutlineWidth: 2,
        minTouchTargetSize: 44 // pixels
    },

    // Development settings (only in dev mode)
    development: {
        enableMockData: false,
        simulateSlowNetwork: false,
        enableDetailedLogging: true,
        showPerformanceMetrics: false
    }
};

// Environment-specific overrides
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    // Development environment
    AppConfig.features.enableDebugMode = true;
    AppConfig.development.enableDetailedLogging = true;
    AppConfig.errorHandling.showErrorDetails = true;
} else {
    // Production environment
    AppConfig.features.enableAnalytics = true;
    AppConfig.errorHandling.enableErrorReporting = true;
    AppConfig.errorHandling.enableConsoleLogging = false;
}

// Utility functions for configuration
AppConfig.utils = {
    // Get configuration value with dot notation
    get: function(path, defaultValue = null) {
        return path.split('.').reduce((obj, key) => {
            return (obj && obj[key] !== 'undefined') ? obj[key] : defaultValue;
        }, AppConfig);
    },

    // Set configuration value with dot notation
    set: function(path, value) {
        const keys = path.split('.');
        const lastKey = keys.pop();
        const target = keys.reduce((obj, key) => {
            if (!obj[key]) obj[key] = {};
            return obj[key];
        }, AppConfig);
        target[lastKey] = value;
    },

    // Check if feature is enabled
    isFeatureEnabled: function(featureName) {
        return AppConfig.features[featureName] === true;
    },

    // Get localized configuration
    getLocalized: function(path, language = null) {
        const lang = language || AppConfig.ui.defaultLanguage;
        const localizedPath = `${path}.${lang}`;
        return this.get(localizedPath) || this.get(path);
    },

    // Validate configuration on startup
    validate: function() {
        const errors = [];

        // Check required configurations
        if (!AppConfig.app.name) {
            errors.push('App name is required');
        }

        if (!AppConfig.ui.supportedLanguages.includes(AppConfig.ui.defaultLanguage)) {
            errors.push('Default language must be in supported languages list');
        }

        if (AppConfig.analysis.maxTasks < 1) {
            errors.push('Maximum tasks must be at least 1');
        }

        if (errors.length > 0) {
            console.error('Configuration validation failed:', errors);
            return false;
        }

        return true;
    },

    // Get theme-specific configuration
    getThemeConfig: function() {
        const theme = AppConfig.ui.theme;
        return {
            primaryColor: theme === 'dark' ? '#3b82f6' : '#1d4ed8',
            backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
            textColor: theme === 'dark' ? '#f9fafb' : '#111827',
            borderColor: theme === 'dark' ? '#4b5563' : '#d1d5db'
        };
    }
};

// Initialize configuration validation
document.addEventListener('DOMContentLoaded', function() {
    if (!AppConfig.utils.validate()) {
        console.warn('Some configuration issues were detected. Please check the console for details.');
    }
    
    // Apply accessibility settings
    if (AppConfig.accessibility.enableReducedMotion) {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        if (mediaQuery.matches) {
            document.body.classList.add('reduce-motion');
        }
    }
    
    // Apply performance settings
    if (AppConfig.performance.enableLazyLoading) {
        document.body.classList.add('lazy-loading-enabled');
    }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AppConfig;
}