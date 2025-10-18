
class UI {
    constructor(journal) {
        this.journal = journal;
    }

    setupEventListeners() {
        this.journal.setupEntryListeners();
        this.journal.setupMoodListeners();
        this.journal.setupTagListeners();
        this.journal.setupControlListeners();
        this.journal.setupModalListeners();
        this.journal.setupOnboardingListeners();
        this.journal.setupAdvancedSearchListeners();
        this.journal.setupBackToTopButton();
    }

    updateCharCountColor(count) {
        const charCount = document.getElementById('charCount');
        if (count > APP_CONFIG.DANGER_CHAR_LIMIT) {
            charCount.style.color = '#e53e3e';
        } else if (count > APP_CONFIG.WARNING_CHAR_LIMIT) {
            charCount.style.color = '#dd6b20';
        } else {
            charCount.style.color = 'var(--text-secondary)';
        }
    }

    updateTagsDisplay() {
        const tagsList = document.getElementById('tagsList');
        tagsList.innerHTML = ''; // Clear existing tags
        this.journal.currentTags.forEach(tag => {
            const tagElement = this.journal.createElement('span', 'tag', tag);

            const removeButton = this.journal.createElement('button', 'tag-remove', '×');
            removeButton.onclick = () => this.journal.removeTag(tag);

            tagElement.appendChild(removeButton);
            tagsList.appendChild(tagElement);
        });
        
        // Update tag filter options
        this.journal.updateTagFilter();
    }

    updateTagFilter() {
        const tagFilter = document.getElementById('tagFilter');
        const allTags = new Set();
        
        // Collect all tags from entries
        this.journal.entries.forEach(entry => {
            if (entry.tags) {
                entry.tags.forEach(tag => allTags.add(tag));
            }
        });
        
        // Keep the current selection
        const currentSelection = tagFilter.value;
        
        // Clear existing options except the first one
        tagFilter.innerHTML = '<option value="">All tags</option>';
        
        // Add all unique tags
        Array.from(allTags).sort().forEach(tag => {
            const option = document.createElement('option');
            option.value = tag;
            option.textContent = tag;
            tagFilter.appendChild(option);
        });
        
        // Restore selection if it still exists
        if (currentSelection && allTags.has(currentSelection)) {
            tagFilter.value = currentSelection;
        }
    }

    showTagSuggestions(input) {
        const suggestionsContainer = document.getElementById('tagSuggestions');
        const query = input.trim().toLowerCase();
        
        if (!query) {
            this.hideTagSuggestions();
            return;
        }

        const suggestions = [];
        
        // Search through all categories
        Object.entries(APP_CONFIG.TAG_CATEGORIES).forEach(([category, tags]) => {
            tags.forEach(tag => {
                if (tag.toLowerCase().includes(query) && !this.journal.currentTags.includes(tag)) {
                    suggestions.push({ tag, category });
                }
            });
        });

        if (suggestions.length === 0) {
            this.hideTagSuggestions();
            return;
        }

        // Limit to 8 suggestions
        const limitedSuggestions = suggestions.slice(0, 8);
        
        suggestionsContainer.innerHTML = ''; // Clear existing suggestions

        limitedSuggestions.forEach(item => {
            const suggestionItem = this.journal.createElement('div', 'tag-suggestion-item');
            suggestionItem.onclick = () => this.journal.selectTagSuggestion(item.tag);

            const suggestionText = this.journal.createElement('span', 'suggestion-text', item.tag);
            const suggestionCategory = this.journal.createElement('span', 'suggestion-category', item.category);

            suggestionItem.appendChild(suggestionText);
            suggestionItem.appendChild(suggestionCategory);
            suggestionsContainer.appendChild(suggestionItem);
        });
        
        suggestionsContainer.style.display = 'block';
    }

    hideTagSuggestions() {
        const suggestionsContainer = document.getElementById('tagSuggestions');
        suggestionsContainer.style.display = 'none';
    }

    openMoodModal() {
        document.getElementById('moodModal').style.display = 'block';
    }

    closeMoodModal() {
        document.getElementById('moodModal').style.display = 'none';
    }

    addSuccessAnimation() {
        const saveBtn = document.getElementById('saveEntry');
        saveBtn.classList.add('success');
        setTimeout(() => saveBtn.classList.remove('success'), 600);
    }

    updateStats() {
        const streak = this.journal.calculateStreak();
        const totalEntries = this.journal.entries.length;
        const today = this.journal.getTodayString();
        const todayEntry = this.journal.entries.find(entry => entry.date === today);
        const avgMood = this.journal.calculateAverageMood();
        
        document.getElementById('streakCount').textContent = streak;
        document.getElementById('totalEntries').textContent = totalEntries;
        document.getElementById('avgMood').textContent = avgMood;
        
        if (todayEntry) {
            const emoji = todayEntry.mood === 'custom' ? todayEntry.customMoodEmoji : MOOD_EMOJIS[todayEntry.mood];
            document.getElementById('currentMood').textContent = emoji;
        } else {
            document.getElementById('currentMood').textContent = '-';
        }
    }

    displayEntries() {
        const entriesList = document.getElementById('entriesList');
        const searchResultsSection = document.getElementById('searchResultsSection');
        const recentEntries = this.journal.entries.slice(0, APP_CONFIG.MAX_ENTRIES_DISPLAY);
        
        // Hide search results section when showing all entries
        if (searchResultsSection) {
            searchResultsSection.style.display = 'none';
        }
        
        entriesList.innerHTML = ''; // Clear existing entries

        if (recentEntries.length === 0) {
            entriesList.innerHTML = `
                <div class="entry-item" style="text-align: center; color: var(--text-secondary);">
                    <p>No entries yet. Start your journaling journey today! ✨</p>
                </div>
            `;
            return;
        }

        recentEntries.forEach(entry => {
            const entryElement = this.journal.createEntryHTML(entry);
            entriesList.appendChild(entryElement);
        });

        this.journal.updateTagFilter();
    }

    displayFilteredEntries(entries, searchConfig = null) {
        const entriesList = document.getElementById('entriesList');
        const searchResultsSection = document.getElementById('searchResultsSection');
        const searchResultsList = document.getElementById('searchResultsList');
        
        entriesList.innerHTML = ''; // Clear main list
        searchResultsList.innerHTML = ''; // Clear search results list

        if (entries.length === 0) {
            const searchQuery = searchConfig?.query || '';
            const noResultsHTML = `
                <div class="entry-item no-results" style="text-align: center; padding: 40px 20px;">
                    <div style="font-size: 3rem; margin-bottom: 16px;">🔍</div>
                    <h3 style="color: var(--text-primary); margin-bottom: 8px;">No entries found</h3>
                    <p style="color: var(--text-secondary); margin-bottom: 16px;">
                        ${searchQuery ? `No entries match "${searchQuery}"` : 'No entries match your search criteria.'}
                    </p>
                    <div style="font-size: 0.9rem; color: var(--text-secondary);">
                        <p>💡 Try:</p>
                        <ul style="text-align: left; display: inline-block; margin: 8px 0;">
                            <li>Using different keywords</li>
                            <li>Checking your spelling</li>
                            <li>Using the advanced search filters</li>
                        </ul>
                    </div>
                </div>
            `;
            
            // Show in search results section if it's a search, otherwise in main list
            if (searchConfig?.query) {
                searchResultsList.innerHTML = noResultsHTML;
                searchResultsSection.style.display = 'block';
            } else {
                entriesList.innerHTML = noResultsHTML;
                searchResultsSection.style.display = 'none';
            }
            return;
        }

        // Show search results info
        this.journal.showSearchResultsInfo(entries.length);

        // Create entries with highlighting if enabled
        entries.forEach(entry => {
            const entryElement = this.journal.createEntryHTML(entry);
            
            // Add highlighting if enabled and query exists
            if (searchConfig?.highlightMatches && searchConfig?.query) {
                this.journal.highlightSearchMatchesInElement(entryElement, searchConfig.query);
            }

            // Display in search results section if it's a search, otherwise in main list
            if (searchConfig?.query) {
                searchResultsList.appendChild(entryElement);
            } else {
                entriesList.appendChild(entryElement);
            }
        });

        if (searchConfig?.query) {
            searchResultsSection.style.display = 'block';
        } else {
            searchResultsSection.style.display = 'none';
        }
    }

    updateSearchResultsCount(count) {
        const entriesList = document.getElementById('entriesList');
        const existingCount = document.querySelector('.search-results-count');
        
        if (existingCount) {
            existingCount.remove();
        }
        
        if (count !== this.journal.entries.length) {
            const countElement = this.journal.createElement('div', 'search-results-count');

            const textElement = this.journal.createElement('span', null, `📊 Showing ${count} of ${this.journal.entries.length} entries`);

            const clearButton = this.journal.createElement('button', 'clear-search-btn', 'Clear Search');
            clearButton.onclick = () => this.journal.clearSearch();

            countElement.appendChild(textElement);
            countElement.appendChild(clearButton);
            entriesList.parentNode.insertBefore(countElement, entriesList);
        }
    }

    showSearchResultsInfo(count) {
        const resultsInfo = document.getElementById('searchResultsInfo');
        const resultsCount = document.getElementById('resultsCount');
        const searchTime = document.getElementById('searchTime');
        
        if (this.journal.searchStartTime) {
            const searchDuration = performance.now() - this.journal.searchStartTime;
            searchTime.textContent = `(${searchDuration.toFixed(2)}ms)`;
        }
        
        resultsCount.textContent = count;
        resultsInfo.style.display = 'flex';
    }

    hideSearchResultsInfo() {
        const resultsInfo = document.getElementById('searchResultsInfo');
        if (resultsInfo) {
            resultsInfo.style.display = 'none';
        }
    }

    updateSearchResultsInfo(count) {
        const resultsInfo = document.getElementById('searchResultsInfo');
        if (count === this.journal.entries.length) {
            resultsInfo.style.display = 'none';
        }
    }

    updateVoiceSearchUI(isRecording) {
        const voiceBtn = document.getElementById('voiceSearchBtn');
        if (isRecording) {
            voiceBtn.classList.add('recording');
            voiceBtn.title = 'Stop voice search';
        } else {
            voiceBtn.classList.remove('recording');
            voiceBtn.title = 'Voice search';
        }
    }

    showSearchSuggestions(query) {
        if (!query || query.length < 2) {
            this.hideSearchSuggestions();
            return;
        }

        const suggestions = this.journal.generateSearchSuggestions(query);
        const suggestionsContainer = document.getElementById('searchSuggestions');
        suggestionsContainer.innerHTML = ''; // Clear existing suggestions

        if (suggestions.length === 0) {
            this.hideSearchSuggestions();
            return;
        }

        suggestions.forEach(suggestion => {
            const suggestionItem = this.journal.createElement('div', 'suggestion-item');
            suggestionItem.onclick = () => this.journal.selectSearchSuggestion(suggestion.text);

            const suggestionIcon = this.journal.createElement('span', 'suggestion-icon', suggestion.icon);
            const suggestionText = this.journal.createElement('span', 'suggestion-text', suggestion.text);
            const suggestionType = this.journal.createElement('span', 'suggestion-type', suggestion.type);

            suggestionItem.appendChild(suggestionIcon);
            suggestionItem.appendChild(suggestionText);
            suggestionItem.appendChild(suggestionType);
            suggestionsContainer.appendChild(suggestionItem);
        });

        suggestionsContainer.style.display = 'block';
    }

    hideSearchSuggestions() {
        const suggestionsContainer = document.getElementById('searchSuggestions');
        suggestionsContainer.style.display = 'none';
    }

    updateSearchHistoryDisplay() {
        const historyList = document.getElementById('searchHistoryList');
        if (!historyList) return;

        historyList.innerHTML = ''; // Clear existing history

        this.journal.searchHistory.forEach(query => {
            const historyItem = this.journal.createElement('div', 'history-item');
            historyItem.onclick = () => this.journal.loadSearchFromHistory(this.journal.escapeHtml(query));

            const historyQuery = this.journal.createElement('span', 'history-query', this.journal.escapeHtml(query));
            const historyTime = this.journal.createElement('span', 'history-time', this.journal.getRelativeTime(new Date()));

            historyItem.appendChild(historyQuery);
            historyItem.appendChild(historyTime);
            historyList.appendChild(historyItem);
        });
    }

    updateSavedSearchesDisplay() {
        const savedList = document.getElementById('savedSearchesList');
        if (!savedList) return;

        savedList.innerHTML = ''; // Clear existing saved searches

        this.journal.savedSearches.forEach((search, index) => {
            const savedSearchItem = this.journal.createElement('div', 'saved-search-item');

            const savedSearchName = this.journal.createElement('span', 'saved-search-name', this.journal.escapeHtml(search.name));

            const savedSearchActions = this.journal.createElement('div', 'saved-search-actions');

            const loadButton = this.journal.createElement('button', null, '📂');
            loadButton.title = 'Load';
            loadButton.onclick = () => this.journal.loadSavedSearch(index);

            const deleteButton = this.journal.createElement('button', null, '🗑️');
            deleteButton.title = 'Delete';
            deleteButton.onclick = () => this.journal.deleteSavedSearch(index);

            savedSearchActions.appendChild(loadButton);
            savedSearchActions.appendChild(deleteButton);
            savedSearchItem.appendChild(savedSearchName);
            savedSearchItem.appendChild(savedSearchActions);
            savedList.appendChild(savedSearchItem);
        });
    }

    showTimelineView() {
        const entriesList = document.getElementById('entriesList');
        entriesList.innerHTML = ''; // Clear existing entries

        const timelineView = this.journal.createElement('div', 'timeline-view');

        const timelineHeader = this.journal.createElement('div', 'timeline-header');
        const timelineTitle = this.journal.createElement('h3', null, '📊 Search Results Timeline');
        const closeButton = this.journal.createElement('button', 'close-btn', '×');
        closeButton.onclick = () => this.journal.hideTimelineView();

        timelineHeader.appendChild(timelineTitle);
        timelineHeader.appendChild(closeButton);

        const timelineContainer = this.journal.createElement('div', 'timeline-container');
        const timelineLine = this.journal.createElement('div', 'timeline-line');
        timelineContainer.appendChild(timelineLine);

        this.journal.currentSearchResults.forEach(entry => {
            const timelineItem = this.journal.createElement('div', 'timeline-item');

            const timelineDate = this.journal.createElement('div', 'timeline-date', entry.date);
            const timelineContent = this.journal.createElement('div', 'timeline-content', this.journal.escapeHtml(entry.text));
            const timelineMood = this.journal.createElement('div', 'timeline-mood', this.journal.getMoodEmoji(entry));

            timelineItem.appendChild(timelineDate);
            timelineItem.appendChild(timelineContent);
            timelineItem.appendChild(timelineMood);
            timelineContainer.appendChild(timelineItem);
        });

        timelineView.appendChild(timelineHeader);
        timelineView.appendChild(timelineContainer);
        entriesList.appendChild(timelineView);
    }

    hideTimelineView() {
        this.journal.displayFilteredEntries(this.journal.currentSearchResults);
    }

    generateCalendar() {
        const calendar = document.getElementById('calendar');
        const currentMonth = document.getElementById('currentMonth');
        
        const year = this.journal.calendarDate.getFullYear();
        const month = this.journal.calendarDate.getMonth();
        
        currentMonth.textContent = new Date(year, month).toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric'
        });
        
        const firstDay = new Date(year, month, 1);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());
        
        calendar.innerHTML = ''; // Clear existing calendar
        const today = this.journal.getTodayString();
        
        for (let i = 0; i < APP_CONFIG.CALENDAR_DAYS; i++) {
            const currentDate = new Date(startDate);
            currentDate.setDate(startDate.getDate() + i);
            
            const dateString = currentDate.toISOString().split('T')[0];
            const isToday = dateString === today;
            const isCurrentMonth = currentDate.getMonth() === month;
            const entry = this.journal.entries.find(e => e.date === dateString);
            
            const dayElement = this.journal.createElement('div', 'calendar-day', currentDate.getDate());
            let dayClass = 'calendar-day';
            if (!isCurrentMonth) dayClass += ' other-month';
            if (isToday) dayClass += ' today';
            if (entry) dayClass += ' has-entry';
            dayElement.className = dayClass;
            dayElement.onclick = () => this.journal.selectCalendarDate(dateString);

            if (entry) {
                const moodDot = this.journal.createElement('span', 'mood-dot', this.journal.getMoodEmoji(entry));
                dayElement.appendChild(moodDot);
            }
            
            calendar.appendChild(dayElement);
        }
    }

    displayVersionInfo() {
        const versionInfo = this.journal.createElement('div', 'version-info');

        const versionSpan = this.journal.createElement('span', null, `v${APP_CONFIG.VERSION}`);
        const separator = this.journal.createElement('span', null, '•');
        const lastUpdatedSpan = this.journal.createElement('span', null, `Last updated: ${APP_CONFIG.LAST_UPDATED}`);

        versionInfo.appendChild(versionSpan);
        versionInfo.appendChild(separator);
        versionInfo.appendChild(lastUpdatedSpan);

        const footer = document.querySelector('footer');
        footer.appendChild(versionInfo);
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
            background: ${type === 'success' ? '#48bb78' : type === 'error' ? '#f56565' : '#4299e1'};
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    updateVoiceUI(isRecording) {
        const voiceBtn = document.getElementById('voiceBtn');
        const voiceStatus = document.getElementById('voiceStatus');
        
        if (isRecording) {
            voiceBtn.classList.add('recording');
            voiceStatus.style.display = 'flex';
        } else {
            voiceBtn.classList.remove('recording');
            voiceStatus.style.display = 'none';
        }
    }

    displayWisdomQuote() {
        if (!this.journal.wisdomEnabled) return;

        const quotes = this.journal.customQuotes.length > 0 ? this.journal.customQuotes : APP_CONFIG.DEFAULT_QUOTES;
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        
        document.getElementById('wisdomQuote').textContent = randomQuote;
        document.getElementById('wisdomSection').style.display = 'block';
    }

    updateFeatureVisibility() {
        const voiceBtn = document.getElementById('voiceBtn');
        const wisdomSection = document.getElementById('wisdomSection');
        const aiSection = document.getElementById('aiSummarySection');

        voiceBtn.style.display = this.journal.voiceEnabled ? 'block' : 'none';
        wisdomSection.style.display = this.journal.wisdomEnabled ? 'block' : 'none';
        aiSection.style.display = this.journal.aiEnabled ? 'block' : 'none';
    }

    displayQuotesList() {
        const quotesList = document.getElementById('quotesList');
        const quotes = this.journal.customQuotes.length > 0 ? this.journal.customQuotes : APP_CONFIG.DEFAULT_QUOTES;
        
        quotesList.innerHTML = ''; // Clear existing quotes

        quotes.forEach((quote, index) => {
            const quoteItem = this.journal.createElement('div', 'quote-item');

            const quoteText = this.journal.createElement('span', 'quote-text', quote);
            const removeButton = this.journal.createElement('button', 'quote-remove', '×');
            removeButton.onclick = () => this.journal.removeCustomQuote(index);

            quoteItem.appendChild(quoteText);
            quoteItem.appendChild(removeButton);
            quotesList.appendChild(quoteItem);
        });
    }
}
