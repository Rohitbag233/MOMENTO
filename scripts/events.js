
class Events {
    constructor(journal) {
        this.journal = journal;
    }

    setupEventListeners() {
        this.setupEntryListeners();
        this.setupMoodListeners();
        this.setupTagListeners();
        this.setupControlListeners();
        this.setupModalListeners();
        this.setupOnboardingListeners();
        this.setupAdvancedSearchListeners();
        this.setupBackToTopButton();
    }

    setupEntryListeners() {
        const journalEntry = document.getElementById('journalEntry');
        const charCount = document.getElementById('charCount');
        const wordCount = document.getElementById('wordCount');
        
        journalEntry.addEventListener('input', (e) => {
            const text = e.target.value;
            const charLength = text.length;
            const wordLength = text.trim().split(/\s+/).filter(Boolean).length;

            charCount.textContent = charLength;
            wordCount.textContent = wordLength;
            this.journal.ui.updateCharCountColor(charLength);
        });

        document.getElementById('saveEntry').addEventListener('click', () => this.journal.saveEntry());
    }

    setupMoodListeners() {
        const moodBtns = document.querySelectorAll('.mood-btn:not(.custom-mood)');
        moodBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Toggle selection - if already selected, deselect it
                if (btn.classList.contains('selected')) {
                    btn.classList.remove('selected');
                    this.journal.selectedMood = null;
                } else {
                    // Remove selection from other buttons
                    moodBtns.forEach(b => b.classList.remove('selected'));
                    // Add selection to clicked button
                    btn.classList.add('selected');
                    this.journal.selectedMood = btn.dataset.mood;
                }
            });
        });

        document.getElementById('customMoodBtn').addEventListener('click', () => {
            this.journal.ui.openMoodModal();
        });

        document.querySelectorAll('.custom-mood-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.journal.selectCustomMood(btn.dataset.emoji);
            });
        });
    }

    setupTagListeners() {
        document.getElementById('addTagBtn').addEventListener('click', () => {
            this.journal.generateRandomTag();
        });

        const tagInput = document.getElementById('tagInput');
        
        tagInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.journal.addTag();
            }
        });

        tagInput.addEventListener('input', (e) => {
            this.journal.ui.showTagSuggestions(e.target.value);
        });

        tagInput.addEventListener('focus', (e) => {
            if (e.target.value.trim()) {
                this.journal.ui.showTagSuggestions(e.target.value);
            }
        });

        // Hide suggestions when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.tags-input')) {
                this.journal.ui.hideTagSuggestions();
            }
        });
    }

    setupControlListeners() {
        document.getElementById('settingsBtn').addEventListener('click', () => {
            this.journal.openSettingsModal();
        });

        // Voice button
        document.getElementById('voiceBtn').addEventListener('click', () => {
            this.journal.toggleVoiceRecording();
        });

        // Wisdom quote refresh
        document.getElementById('refreshQuote').addEventListener('click', () => {
            this.journal.ui.displayWisdomQuote();
        });

        // AI summary generation
        document.getElementById('generateSummary').addEventListener('click', () => {
            this.journal.generateAISummary();
        });

        // Search and filter
        document.getElementById('searchInput').addEventListener('input', () => {
            this.journal.filterEntries();
        });

        document.getElementById('moodFilter').addEventListener('change', () => {
            this.journal.filterEntries();
        });

        document.getElementById('tagFilter').addEventListener('change', () => {
            this.journal.filterEntries();
        });

        // Calendar controls
        document.getElementById('prevMonth').addEventListener('click', () => {
            this.journal.calendarDate.setMonth(this.journal.calendarDate.getMonth() - 1);
            this.journal.ui.generateCalendar();
        });

        document.getElementById('nextMonth').addEventListener('click', () => {
            this.journal.calendarDate.setMonth(this.journal.calendarDate.getMonth() + 1);
            this.journal.ui.generateCalendar();
        });
    }

    setupModalListeners() {
        // Modal close buttons
        document.getElementById('closeMoodModal').addEventListener('click', () => {
            this.journal.ui.closeMoodModal();
        });

        document.getElementById('closeBackupModal').addEventListener('click', () => {
            this.journal.closeBackupModal();
        });

        document.getElementById('closeEditModal').addEventListener('click', () => {
            this.journal.closeEditModal();
        });

        document.getElementById('closeSettingsModal').addEventListener('click', () => {
            this.journal.closeSettingsModal();
        });

        document.getElementById('closeAIConfigModal').addEventListener('click', () => {
            this.journal.closeAIConfigModal();
        });

        document.getElementById('closeCustomQuotesModal').addEventListener('click', () => {
            this.journal.closeCustomQuotesModal();
        });

        // Backup actions
        document.getElementById('exportBtn').addEventListener('click', () => {
            this.journal.exportData();
        });

        document.getElementById('importBtn').addEventListener('click', () => {
            document.getElementById('importFile').click();
        });

        document.getElementById('importFile').addEventListener('change', (e) => {
            this.journal.importData(e);
        });

        // Edit modal actions
        document.getElementById('saveEditBtn').addEventListener('click', () => {
            this.journal.saveEdit();
        });

        document.getElementById('deleteEntryBtn').addEventListener('click', () => {
            this.journal.deleteEntry();
        });

        // Settings actions
        document.getElementById('voiceEnabled').addEventListener('change', () => {
            this.journal.toggleVoiceFeature();
        });

        document.getElementById('wisdomEnabled').addEventListener('change', () => {
            this.journal.toggleWisdomFeature();
        });

        document.getElementById('aiEnabled').addEventListener('change', () => {
            this.journal.toggleAIFeature();
        });

        document.getElementById('customizeQuotes').addEventListener('click', () => {
            this.journal.openCustomQuotesModal();
        });

        document.getElementById('configureAI').addEventListener('click', () => {
            this.journal.openAIConfigModal();
        });

        document.getElementById('backupFromSettings').addEventListener('click', () => {
            this.journal.openBackupModal();
        });

        // Theme toggle
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('change', () => {
                this.journal.toggleTheme();
            });
        }

        // AI Configuration actions
        document.getElementById('saveAIConfig').addEventListener('click', () => {
            this.journal.saveAIConfiguration();
        });

        document.getElementById('testAIConnection').addEventListener('click', () => {
            this.journal.testAIConnection();
        });

        // AI Provider change handler
        document.getElementById('aiProvider').addEventListener('change', () => {
            this.journal.updateModelOptions();
        });

        // Custom Quotes actions
        document.getElementById('addQuoteBtn').addEventListener('click', () => {
            this.journal.addCustomQuote();
        });

        document.getElementById('resetQuotes').addEventListener('click', () => {
            this.journal.resetToDefaultQuotes();
        });

        document.getElementById('saveQuotes').addEventListener('click', () => {
            this.journal.saveCustomQuotes();
        });

        document.getElementById('generateAIQuote').addEventListener('click', () => {
            this.journal.generateAIQuote();
        });

        // API Key toggle functionality
        const toggleApiKeyBtn = document.getElementById('toggleApiKey');
        if (toggleApiKeyBtn) {
            toggleApiKeyBtn.addEventListener('click', () => {
                const apiKeyInput = document.getElementById('apiKey');
                const toggleBtn = document.getElementById('toggleApiKey');
                
                if (apiKeyInput && toggleBtn) {
                    if (apiKeyInput.type === 'password') {
                        apiKeyInput.type = 'text';
                        toggleBtn.textContent = '🙈';
                        toggleBtn.title = 'Hide API Key';
                    } else {
                        apiKeyInput.type = 'password';
                        toggleBtn.textContent = '👁️';
                        toggleBtn.title = 'Show API Key';
                    }
                }
            });
        }

        // Close modals when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.style.display = 'none';
            }
        });
    }

    setupOnboardingListeners() {
        document.getElementById('onboardingNext1').addEventListener('click', () => {
            this.journal.nextOnboardingStep();
        });
        document.getElementById('onboardingNext2').addEventListener('click', () => {
            this.journal.nextOnboardingStep();
        });
        document.getElementById('onboardingNext3').addEventListener('click', () => {
            this.journal.nextOnboardingStep();
        });
        document.getElementById('onboardingFinish').addEventListener('click', () => {
            this.journal.finishOnboarding();
        });
    }

    setupAdvancedSearchListeners() {
        // Toggle advanced search
        const toggleBtn = document.getElementById('toggleAdvancedSearch');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                this.journal.toggleAdvancedSearch();
            });
        }

        // Voice search
        document.getElementById('voiceSearchBtn')?.addEventListener('click', () => {
            this.journal.toggleVoiceSearch();
        });

        // Clear search
        document.getElementById('clearSearchBtn')?.addEventListener('click', () => {
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                searchInput.value = '';
            }
            this.journal.ui.hideSearchSuggestions();
            this.journal.ui.displayEntries(); // Show all entries
            this.journal.ui.hideSearchResultsInfo();
            
            // Hide search results section
            const searchResultsSection = document.getElementById('searchResultsSection');
            if (searchResultsSection) {
                searchResultsSection.style.display = 'none';
            }
        });

        // Clear search results
        document.getElementById('clearSearchResults')?.addEventListener('click', () => {
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                searchInput.value = '';
            }
            this.journal.ui.hideSearchSuggestions();
            this.journal.ui.displayEntries(); // Show all entries
            this.journal.ui.hideSearchResultsInfo();
            
            // Hide search results section
            const searchResultsSection = document.getElementById('searchResultsSection');
            if (searchResultsSection) {
                searchResultsSection.style.display = 'none';
            }
        });

        document.getElementById('searchDate')?.addEventListener('input', () => {
            this.journal.filterEntries();
        });

        // Basic search input - triggers on every keystroke
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            let searchTimeout;
            
            searchInput.addEventListener('input', (e) => {
                const query = e.target.value.trim();
                
                // Add searching class for visual feedback
                searchInput.classList.add('searching');
                
                // Clear previous timeout
                clearTimeout(searchTimeout);
                
                // Debounce search to avoid too many calls
                searchTimeout = setTimeout(() => {
                    this.journal.ui.showSearchSuggestions(query);
                    this.journal.filterEntries(); // This now does basic search
                    
                    // Remove searching class after search completes
                    setTimeout(() => {
                        searchInput.classList.remove('searching');
                    }, 300);
                }, 200);
            });

            // Also trigger search on Enter key
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    clearTimeout(searchTimeout);
                    this.journal.filterEntries();
                    searchInput.classList.remove('searching');
                }
            });
        }

        // Advanced search button
        document.getElementById('applySearch')?.addEventListener('click', () => {
            const searchConfig = this.journal.getSearchConfiguration();
            this.journal.performAdvancedSearch(searchConfig);
        });

        // Quick filters
        document.querySelectorAll('.quick-filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                btn.classList.toggle('active');
                // For quick filters, use advanced search
                const searchConfig = this.journal.getSearchConfiguration();
                this.journal.performAdvancedSearch(searchConfig);
            });
        });

        // Date presets
        document.querySelectorAll('.date-preset-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.journal.applyDatePreset(btn.dataset.preset);
                // Use advanced search after applying date preset
                const searchConfig = this.journal.getSearchConfiguration();
                this.journal.performAdvancedSearch(searchConfig);
            });
        });

        // Search actions
        document.getElementById('saveSearch')?.addEventListener('click', () => {
            this.journal.saveCurrentSearch();
        });

        document.getElementById('clearAllFilters')?.addEventListener('click', () => {
            this.journal.clearAllFilters();
        });

        // Results actions
        document.getElementById('pinResults')?.addEventListener('click', () => {
            this.journal.pinCurrentResults();
        });

        document.getElementById('exportResults')?.addEventListener('click', () => {
            this.journal.exportSearchResults();
        });

        document.getElementById('timelineView')?.addEventListener('click', () => {
            this.journal.ui.showTimelineView();
        });

        document.getElementById('printResults')?.addEventListener('click', () => {
            this.journal.printResults();
        });

        // Initialize voice search
        this.journal.initializeVoiceSearch();
    }

    setupBackToTopButton() {
        const backToTopBtn = document.getElementById('backToTopBtn');

        window.onscroll = () => {
            if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
                backToTopBtn.style.display = 'block';
            } else {
                backToTopBtn.style.display = 'none';
            }
        };

        backToTopBtn.addEventListener('click', () => {
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
        });
    }
}
