import React, { useState, useEffect } from 'react';
import { 
  Calendar, Gift, Bell, Edit, Trash2, Plus, User, X, Cake, Heart, 
  Star, Search, Moon, Sun, Filter, Download, Upload, MessageCircle,
  Settings, ChevronDown, Tags, Package, CheckCircle, ArrowUpDown, Save,
  Share2, Mail, Copy, Facebook, Twitter, Smartphone
} from 'lucide-react';

export default function BirthdayApp() {
  const [birthdays, setBirthdays] = useState([]);
  const [newBirthdayForm, setNewBirthdayForm] = useState({
    name: '',
    date: '',
    notes: '',
    category: 'friends',
    giftIdeas: '',
    reminder: '7'  // Default reminder 7 days before
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [todaysBirthdays, setTodaysBirthdays] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [showBirthdayDetail, setShowBirthdayDetail] = useState(null);
  const [sortBy, setSortBy] = useState('upcoming'); 
  const [openMenuId, setOpenMenuId] = useState(null);
  const toggleShareMenu = id =>
    setOpenMenuId(openMenuId === id ? null : id);
  const socialShareUrls = b => {
    const text = encodeURIComponent(
      `${b.name}'s birthday is on ${b.date}!`
    );
    const url = encodeURIComponent(window.location.href);
    return {
      twitter:  `https://twitter.com/intent/tweet?text=${text}%20${url}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`,
      whatsapp:`https://api.whatsapp.com/send?text=${text}%20${url}`
    };
  };
  const shareBirthday = async b => {
    const text = `${b.name}'s birthday is on ${b.date}. ${b.notes || ''}`.trim();
    const url  = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Birthday Buddy', text, url });
      } catch (err) {
        console.error('Share failed:', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${text} ${url}`);
        alert('Birthday info copied to clipboard!');
      } catch {
        prompt('Copy this text to share:', `${text} ${url}`);
      }
    }
  };

  useEffect(() => {
    const savedBirthdays = localStorage.getItem('birthdays');
    const savedDarkMode = localStorage.getItem('darkMode');
    
    if (savedBirthdays) {
      setBirthdays(JSON.parse(savedBirthdays));
    }
    
    if (savedDarkMode) {
      setDarkMode(JSON.parse(savedDarkMode));
    }
  }, []);

  // Save birthdays to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('birthdays', JSON.stringify(birthdays));
    checkTodaysBirthdays();
  }, [birthdays]);
  
  // Apply dark mode class to body
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);
  useEffect(() => {
    if ('Notification' in window) {
      Notification.requestPermission()
        .then(permission => console.log('Notif permission:', permission));
    }
  }, []);

  useEffect(() => {
    if (Notification.permission !== 'granted') return;

    const now = new Date();
    birthdays.forEach(b => {
      const [year, month, day] = b.date.split('-').map(Number);
      let next = new Date(now.getFullYear(), month - 1, day);
      if (next < now) next.setFullYear(now.getFullYear() + 1);

      const remindDays = parseInt(b.reminder, 10);
      const remindDate = new Date(next);
      remindDate.setDate(next.getDate() - remindDays);

      if (
        remindDate.getFullYear() === now.getFullYear() &&
        remindDate.getMonth()    === now.getMonth() &&
        remindDate.getDate()     === now.getDate()
      ) {
        new Notification('🎂 Birthday Reminder', {
          body: `${b.name}'s birthday is in ${remindDays} day${remindDays>1?'s':''} (${b.date})`
        });
      }
    });
  }, [birthdays]);

  const checkTodaysBirthdays = () => {
    const today = new Date();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    
    // Format today's date as MM-DD for comparison
    const todayFormatted = `${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    
    // Find birthdays that match today's month and day
    const todaysCelebrations = birthdays.filter(person => {
      const birthdayDate = new Date(person.date);
      const birthdayMonth = birthdayDate.getMonth() + 1;
      const birthdayDay = birthdayDate.getDate();
      const birthdayFormatted = `${birthdayMonth.toString().padStart(2, '0')}-${birthdayDay.toString().padStart(2, '0')}`;
      
      return birthdayFormatted === todayFormatted;
    });
    
    setTodaysBirthdays(todaysCelebrations);
    
    // Trigger confetti if it's someone's birthday today
    if (todaysCelebrations.length > 0 && !showConfetti) {
      setShowConfetti(true);
      launchConfetti();
    }
  };

  // Function to launch confetti effect
  const launchConfetti = () => {
    setShowConfetti(true);
    
    // Set up a timeout to remove the confetti after 5 seconds
    const confettiTimer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000);
    
    // Clean up the timer if the component unmounts
    return () => clearTimeout(confettiTimer);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBirthdayForm({
      ...newBirthdayForm,
      [name]: value
    });
  };

  // Add a new birthday
  const addBirthday = () => {
    if (!newBirthdayForm.name || !newBirthdayForm.date) return;
    
    const newBirthday = {
      id: Date.now(),
      name: newBirthdayForm.name,
      date: newBirthdayForm.date,
      notes: newBirthdayForm.notes,
      category: newBirthdayForm.category,
      giftIdeas: newBirthdayForm.giftIdeas,
      reminder: newBirthdayForm.reminder
    };
    
    setBirthdays([...birthdays, newBirthday]);
    setNewBirthdayForm({ 
      name: '', 
      date: '', 
      notes: '', 
      category: 'friends', 
      giftIdeas: '', 
      reminder: '7' 
    });
    setShowAddForm(false);
  };

  // Delete a birthday
  const deleteBirthday = (id) => {
    setBirthdays(birthdays.filter(birthday => birthday.id !== id));
    if (showBirthdayDetail === id) {
      setShowBirthdayDetail(null);
    }
  };

  // Start editing a birthday
  const startEditing = (birthday) => {
    setEditingId(birthday.id);
    setNewBirthdayForm({
      name: birthday.name,
      date: birthday.date,
      notes: birthday.notes,
      category: birthday.category || 'friends',
      giftIdeas: birthday.giftIdeas || '',
      reminder: birthday.reminder || '7'
    });
    setShowBirthdayDetail(null);
  };

  // Save edits to a birthday
  const saveEdit = () => {
    setBirthdays(birthdays.map(birthday => 
      birthday.id === editingId 
        ? { 
            ...birthday, 
            name: newBirthdayForm.name, 
            date: newBirthdayForm.date, 
            notes: newBirthdayForm.notes,
            category: newBirthdayForm.category,
            giftIdeas: newBirthdayForm.giftIdeas,
            reminder: newBirthdayForm.reminder
          }
        : birthday
    ));
    setEditingId(null);
    setNewBirthdayForm({ 
      name: '', 
      date: '', 
      notes: '', 
      category: 'friends', 
      giftIdeas: '', 
      reminder: '7' 
    });
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingId(null);
    setNewBirthdayForm({ 
      name: '', 
      date: '', 
      notes: '', 
      category: 'friends', 
      giftIdeas: '', 
      reminder: '7' 
    });
  };

  // Format date for display (returns "Month Day")
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
  };

  // Calculate days until birthday
  const getDaysUntil = (dateString) => {
    const today = new Date();
    const birthDate = new Date(dateString);
    
    // Set both dates to the current year
    const birthThisYear = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
    
    // If birthday already happened this year, look at next year
    if (birthThisYear < today) {
      birthThisYear.setFullYear(today.getFullYear() + 1);
    }
    
    // Calculate the difference in days
    const diffTime = birthThisYear - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today!";
    if (diffDays === 1) return "Tomorrow!";
    return `${diffDays} days`;
  };

  // Calculate age from birthdate
  const calculateAge = (dateString) => {
    const today = new Date();
    const birthDate = new Date(dateString);
    
    // Get birth year from the full date
    const birthYear = birthDate.getFullYear();
    
    // Don't calculate age if year is current year or no year provided
    if (birthYear === today.getFullYear()) return null;
    
    let age = today.getFullYear() - birthYear;
    
    // Adjust age if birthday hasn't occurred yet this year
    const hasBirthdayOccurredThisYear = (
      today.getMonth() > birthDate.getMonth() || 
      (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate())
    );
    
    if (!hasBirthdayOccurredThisYear) {
      age--;
    }
    
    return age;
  };

  // Get birthday reminders based on reminder preferences
  const getBirthdayReminders = () => {
    const today = new Date();
    
    return birthdays.filter(birthday => {
      const birthDate = new Date(birthday.date);
      const birthThisYear = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
      
      // If birthday already happened this year, look at next year
      if (birthThisYear < today) {
        birthThisYear.setFullYear(today.getFullYear() + 1);
      }
      
      // Calculate the difference in days
      const diffTime = birthThisYear - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      // Check if it's within reminder period
      const reminderDays = parseInt(birthday.reminder || 7);
      return diffDays > 0 && diffDays <= reminderDays;
    });
  };

  // Export birthdays data
  const exportData = () => {
    const dataStr = JSON.stringify(birthdays, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.download = 'birthday-buddy-export.json';
    link.href = url;
    link.click();
  };
  
  // Import birthdays data
  const importData = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedData = JSON.parse(event.target.result);
        if (Array.isArray(importedData)) {
          setBirthdays(importedData);
        }
      } catch (error) {
        alert('Invalid file format. Please upload a valid JSON file.');
      }
    };
    reader.readAsText(file);
  };

  // Filter and sort birthdays
  const getFilteredAndSortedBirthdays = () => {
    // First apply search term
    let filtered = birthdays.filter(birthday => 
      birthday.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      birthday.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
      birthday.giftIdeas?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    // Then apply category filter
    if (activeFilter !== 'all') {
      filtered = filtered.filter(birthday => birthday.category === activeFilter);
    }
    
    // Then sort them
    if (sortBy === 'name') {
      // Sort by name alphabetically
      return [...filtered].sort((a, b) => a.name.localeCompare(b.name));
    } else {
      // Sort by upcoming date (default)
      return [...filtered].sort((a, b) => {
        const today = new Date();
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        
        // Set both dates to the current year
        const birthA = new Date(today.getFullYear(), dateA.getMonth(), dateA.getDate());
        const birthB = new Date(today.getFullYear(), dateB.getMonth(), dateB.getDate());
        
        // If birthday already happened this year, look at next year
        if (birthA < today) birthA.setFullYear(today.getFullYear() + 1);
        if (birthB < today) birthB.setFullYear(today.getFullYear() + 1);
        
        return birthA - birthB;
      });
    }
  };

  // Get color for category
  const getCategoryColor = (category) => {
    switch(category) {
      case 'family':
        return { bg: 'bg-purple-100', text: 'text-purple-800', darkBg: 'bg-purple-900', darkText: 'text-purple-200' };
      case 'friends':
        return { bg: 'bg-blue-100', text: 'text-blue-800', darkBg: 'bg-blue-900', darkText: 'text-blue-200' };
      case 'work':
        return { bg: 'bg-green-100', text: 'text-green-800', darkBg: 'bg-green-900', darkText: 'text-green-200' };
      case 'other':
        return { bg: 'bg-amber-100', text: 'text-amber-800', darkBg: 'bg-amber-900', darkText: 'text-amber-200' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-800', darkBg: 'bg-gray-800', darkText: 'text-gray-200' };
    }
  };

  // Get upcoming notifications
  const upcomingReminders = getBirthdayReminders();
  const filteredBirthdays = getFilteredAndSortedBirthdays();

  return (
    <div className={`flex flex-col min-h-screen transition-colors duration-300 ${
      darkMode 
        ? 'bg-gray-900 text-gray-100' 
        : 'bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-800'
    } p-4 sm:p-6`}>
      {/* App Header */}
      <header className={`${
        darkMode ? 'bg-gray-800 border-blue-700' : 'bg-white border-blue-500'
      } rounded-lg shadow-lg p-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between border-b-4`}>
        <div className="flex items-center mb-4 sm:mb-0">
          <div className={`${
            darkMode ? 'bg-blue-700' : 'bg-blue-500'
          } text-white p-2 rounded-lg mr-3`}>
            <Cake size={24} />
          </div>
          <div>
            <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Birthday Buddy</h1>
            <p className={`text-sm ${darkMode ? 'text-blue-300' : 'text-blue-500'} hidden sm:block`}>Never miss a special day</p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className={`${
              darkMode 
                ? 'bg-gray-700 text-yellow-300 hover:bg-gray-600' 
                : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
            } p-2 rounded-lg transition-colors`}
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <button
            onClick={exportData}
            className={`${
              darkMode 
                ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' 
                : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
            } p-2 rounded-lg transition-colors`}
            aria-label="Export data"
            title="Export birthdays"
          >
            <Download size={20} />
          </button>
          
          <label className={`${
            darkMode 
              ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' 
              : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
          } p-2 rounded-lg transition-colors cursor-pointer`}>
            <Upload size={20} />
            <input
              type="file"
              accept=".json"
              onChange={importData}
              className="hidden"
              aria-label="Import data"
              title="Import birthdays"
            />
          </label>
          
          <button 
            onClick={() => setShowAddForm(true)}
            className={`${
              darkMode 
                ? 'bg-blue-700 hover:bg-blue-600' 
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white px-4 py-2 rounded-lg flex items-center transition-colors shadow-md ml-2`}
          >
            <Plus size={18} className="mr-1" />
            Add Birthday
          </button>
        </div>
      </header>

      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-wrap justify-center">
              {[...Array(30)].map((_, i) => (
                <div 
                  key={i}
                  className="text-4xl animate-bounce" 
                  style={{ 
                    animationDelay: `${i * 0.1}s`,
                    position: 'absolute',
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`
                  }}
                >
                  {['🎉', '🎂', '🎈', '🎁', '🎊', '⭐', '🌟'][i % 7]}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
     
      {/* Birthday Reminders */}
      {upcomingReminders.length > 0 && (
        <div className={`${
          darkMode ? 'bg-yellow-900 text-yellow-100' : 'bg-amber-100 text-amber-900'
        } rounded-lg shadow-xl p-4 mb-6 ring-2 ${darkMode ? 'ring-yellow-700' : 'ring-amber-300'}`}>
          <h2 className="text-lg font-bold mb-2 flex items-center">
            <Bell className="mr-2" />
            Upcoming Birthday Reminders
          </h2>
          <div className="space-y-2">
            {upcomingReminders.map(reminder => (
              <div 
                key={reminder.id} 
                className={`${
                  darkMode ? 'bg-yellow-800 bg-opacity-50' : 'bg-amber-50'
                } rounded-lg p-3 border-l-4 ${darkMode ? 'border-yellow-600' : 'border-amber-400'}`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{reminder.name}'s birthday in {getDaysUntil(reminder.date)}</p>
                    <p className="text-sm">{formatDate(reminder.date)}</p>
                  </div>
                  <button 
                    onClick={() => setShowBirthdayDetail(reminder.id)}
                    className={`${
                      darkMode ? 'text-yellow-200 hover:text-yellow-100' : 'text-amber-600 hover:text-amber-800'
                    } text-sm flex items-center`}
                  >
                    Details <ChevronDown size={14} className="ml-1" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Today's Birthday Celebrations */}
      {todaysBirthdays.length > 0 && (
        <div className={`${
          darkMode 
            ? 'bg-gradient-to-r from-blue-900 to-indigo-900 text-white ring-4 ring-blue-800' 
            : 'bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg shadow-xl text-white ring-4 ring-blue-200'
        } p-6 mb-6`}>
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <Gift className="mr-2" />
            Today's Celebrations!
          </h2>
          <div className="space-y-3">
            {todaysBirthdays.map(person => (
              <div 
                key={person.id} 
                className={`${
                  darkMode ? 'bg-white bg-opacity-10' : 'bg-white bg-opacity-20'
                } rounded-lg p-4 border-l-4 border-yellow-400`}
              >
                <div className="flex items-center">
                  <div className="bg-yellow-400 text-blue-800 p-2 rounded-full mr-3">
                    <Cake size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-lg">
                      Happy Birthday, {person.name}! 🎉
                      {calculateAge(person.date) && 
                        <span className="ml-2 text-sm bg-white bg-opacity-20 px-2 py-1 rounded-full">
                          Turning {calculateAge(person.date)}
                        </span>
                      }
                    </p>
                    {person.notes && <p className="italic mt-1 text-blue-100">{person.notes}</p>}
                    
                    <div className="mt-2 flex items-center">
                      <span className={`text-xs mr-2 px-2 py-1 rounded-full ${
                        darkMode ? getCategoryColor(person.category).darkBg : 'bg-white bg-opacity-30'
                      }`}>
                        {person.category || 'friends'}
                      </span>
                      
                      {person.giftIdeas && (
                        <span className="text-xs flex items-center">
                          <Gift size={12} className="mr-1" /> Gift ideas available
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="mt-3 flex justify-end">
                  <button 
                    onClick={() => startEditing(person)}
                    className="bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1 rounded-lg text-sm mr-2 transition-colors"
                  >
                    <Edit size={14} className="inline mr-1" /> Edit
                  </button>
                  
                  <button 
                    onClick={() => setShowBirthdayDetail(person.id !== showBirthdayDetail ? person.id : null)}
                    className="bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1 rounded-lg text-sm transition-colors"
                  >
                    {showBirthdayDetail === person.id ? 'Hide Details' : 'Show Details'}
                  </button>
                </div>
                
                {showBirthdayDetail === person.id && (
                  <div className="mt-3 bg-white bg-opacity-10 p-3 rounded-lg">
                    <h3 className="font-medium mb-2">Birthday Details:</h3>
                    <p><span className="opacity-80">Date:</span> {formatDate(person.date)}</p>
                    {calculateAge(person.date) && 
                      <p><span className="opacity-80">Age:</span> {calculateAge(person.date)}</p>
                    }
                    <p><span className="opacity-80">Reminder:</span> {person.reminder || 7} days before</p>
                    {person.notes && (
                      <p className="mt-2"><span className="opacity-80">Notes:</span> {person.notes}</p>
                    )}
                    {person.giftIdeas && (
                      <div className="mt-2">
                        <p className="opacity-80 mb-1">Gift Ideas:</p>
                        <p className="bg-white bg-opacity-10 p-2 rounded">{person.giftIdeas}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add/Edit Birthday Form */}
      {(showAddForm || editingId) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`${
            darkMode ? 'bg-gray-800 border-blue-700' : 'bg-white border-blue-500'
          } rounded-lg p-6 w-full max-w-md shadow-2xl border-t-4 animate-fade-in overflow-y-auto max-h-[90vh]`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-blue-800'} flex items-center`}>
                {editingId ? (
                  <>
                    <Edit className={`mr-2 ${darkMode ? 'text-blue-400' : 'text-blue-500'}`} size={22} />
                    Edit Birthday
                  </>
                ) : (
                  <>
                    <Gift className={`mr-2 ${darkMode ? 'text-blue-400' : 'text-blue-500'}`} size={22} />
                    Add New Birthday
                  </>
                )}
              </h2>
              <button 
                onClick={() => {
                  setShowAddForm(false);
                  cancelEdit();
                }}
                className={`${
                  darkMode ? 'text-gray-400 hover:text-gray-200 bg-gray-700' : 'text-gray-400 hover:text-gray-600 bg-gray-100'
                } p-1 rounded-full`}
              >
                <X size={20} />
              </button>
            </div>
            
            <div>
              <div className="mb-5">
                <label className={`block ${darkMode ? 'text-gray-200' : 'text-gray-700'} mb-2 font-medium`}>Name:</label>
                <div className={`flex items-center border-2 rounded-lg px-3 py-2 ${
                  darkMode 
                    ? 'border-gray-600 focus-within:border-blue-500 hover:border-gray-500' 
                    : 'focus-within:border-blue-500 hover:border-blue-300'
                } transition-colors`}>
                  <User size={18} className={`${darkMode ? 'text-blue-400' : 'text-blue-400'} mr-2`} />
                  <input
                    type="text"
                    name="name"
                    value={newBirthdayForm.name}
                    onChange={handleInputChange}
                    className={`flex-1 outline-none ${darkMode ? 'bg-gray-800 text-white' : ''}`}
                    placeholder="Enter name"
                  />
                </div>
              </div>
              
              <div className="mb-5">
                <label className={`block ${darkMode ? 'text-gray-200' : 'text-gray-700'} mb-2 font-medium`}>Birth Date:</label>
                <div className={`flex items-center border-2 rounded-lg px-3 py-2 ${
                  darkMode 
                    ? 'border-gray-600 focus-within:border-blue-500 hover:border-gray-500' 
                    : 'focus-within:border-blue-500 hover:border-blue-300'
                } transition-colors`}>
                  <Calendar size={18} className={`${darkMode ? 'text-blue-400' : 'text-blue-400'} mr-2`} />
                  <input
                    type="date"
                    name="date"
                    value={newBirthdayForm.date}
                    onChange={handleInputChange}
                    className={`flex-1 outline-none ${darkMode ? 'bg-gray-800 text-white' : ''}`}
                  />
                </div>
              </div>

              <div className="mb-5">
                <label className={`block ${darkMode ? 'text-gray-200' : 'text-gray-700'} mb-2 font-medium`}>Category:</label>
                <div className={`flex items-center border-2 rounded-lg px-3 py-2 ${
                  darkMode 
                    ? 'border-gray-600 focus-within:border-blue-500 hover:border-gray-500' 
                    : 'focus-within:border-blue-500 hover:border-blue-300'
                } transition-colors`}>
                  <Tags size={18} className={`${darkMode ? 'text-blue-400' : 'text-blue-400'} mr-2`} />
                  <select
                    name="category"
                    value={newBirthdayForm.category}
                    onChange={handleInputChange}
                    className={`flex-1 outline-none ${darkMode ? 'bg-gray-800 text-white' : ''}`}
                  >
                    <option value="friends">Friends</option>
                    <option value="family">Family</option>
                    <option value="work">Work</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              
              <div className="mb-5">
                <label className={`block ${darkMode ? 'text-gray-200' : 'text-gray-700'} mb-2 font-medium`}>Reminder:</label>
                <div className={`flex items-center border-2 rounded-lg px-3 py-2 ${
                  darkMode 
                    ? 'border-gray-600 focus-within:border-blue-500 hover:border-gray-500' 
                    : 'focus-within:border-blue-500 hover:border-blue-300'
                } transition-colors`}>
                  <Bell size={18} className={`${darkMode ? 'text-blue-400' : 'text-blue-400'} mr-2`} />
                  <select
                    name="reminder"
                    value={newBirthdayForm.reminder}
                    onChange={handleInputChange}
                    className={`flex-1 outline-none ${darkMode ? 'bg-gray-800 text-white' : ''}`}
                  >
                    <option value="1">1 day before</option>
                    <option value="3">3 days before</option>
                    <option value="7">1 week before</option>
                    <option value="14">2 weeks before</option>
                    <option value="30">1 month before</option>
                  </select>
                </div>
              </div>
              
              <div className="mb-5">
                <label className={`block ${darkMode ? 'text-gray-200' : 'text-gray-700'} mb-2 font-medium`}>Notes (optional):</label>
                <div className={`border-2 rounded-lg ${
                  darkMode 
                    ? 'border-gray-600 focus-within:border-blue-500 hover:border-gray-500' 
                    : 'focus-within:border-blue-500 hover:border-blue-300'
                } transition-colors`}>
                  <textarea
                    name="notes"
                    value={newBirthdayForm.notes}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 focus:outline-none ${darkMode ? 'bg-gray-800 text-white' : ''}`}
                    placeholder="Add a special note or memory"
                    rows="2"
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <label className={`block ${darkMode ? 'text-gray-200' : 'text-gray-700'} mb-2 font-medium`}>Gift Ideas (optional):</label>
                <div className={`border-2 rounded-lg ${
                  darkMode 
                    ? 'border-gray-600 focus-within:border-blue-500 hover:border-gray-500' 
                    : 'focus-within:border-blue-500 hover:border-blue-300'
                } transition-colors`}>
                  <textarea
                    name="giftIdeas"
                    value={newBirthdayForm.giftIdeas}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 focus:outline-none ${darkMode ? 'bg-gray-800 text-white' : ''}`}
                    placeholder="List some gift ideas for this person"
                    rows="2"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                {editingId && (
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className={`px-5 py-2 rounded-lg font-medium transition-colors ${
                      darkMode 
                        ? 'border-2 border-gray-600 hover:bg-gray-700' 
                        : 'border-2 border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="button"
                  onClick={editingId ? saveEdit : addBirthday}
                  className={`px-5 py-2 rounded-lg font-medium shadow-md transition-colors ${
                    darkMode 
                      ? 'bg-blue-700 hover:bg-blue-600 text-white' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {editingId ? "Save Changes" : "Add Birthday"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filter Bar */}
      <div className={`${
        darkMode ? 'bg-gray-800' : 'bg-white'
      } rounded-lg shadow-md p-4 mb-6 flex flex-col sm:flex-row gap-3`}>
        {/* Search Input */}
        <div className="flex-1 relative">
          <div className={`flex items-center border-2 rounded-lg px-3 py-2 ${
            darkMode 
              ? 'border-gray-700 focus-within:border-blue-500' 
              : 'border-gray-200 focus-within:border-blue-500'
          } transition-colors`}>
            <Search size={18} className={`${darkMode ? 'text-gray-400' : 'text-gray-400'} mr-2`} />
            <input
              type="text"
              placeholder="Search birthdays..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`flex-1 outline-none ${darkMode ? 'bg-gray-800 text-white' : ''}`}
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
        
        {/* Filter Buttons */}
        <div className="flex">
          <div className={`flex rounded-lg overflow-hidden border-2 ${
            darkMode ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-2 text-sm font-medium ${
                activeFilter === 'all'
                  ? darkMode
                    ? 'bg-blue-700 text-white'
                    : 'bg-blue-600 text-white'
                  : darkMode
                    ? 'text-gray-300 hover:bg-gray-700'
                    : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveFilter('family')}
              className={`px-3 py-2 text-sm font-medium ${
                activeFilter === 'family'
                  ? darkMode
                    ? 'bg-purple-700 text-white'
                    : 'bg-purple-600 text-white'
                  : darkMode
                    ? 'text-gray-300 hover:bg-gray-700'
                    : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Family
            </button>
            <button
              onClick={() => setActiveFilter('friends')}
              className={`px-3 py-2 text-sm font-medium ${
                activeFilter === 'friends'
                  ? darkMode
                    ? 'bg-blue-700 text-white'
                    : 'bg-blue-600 text-white'
                  : darkMode
                    ? 'text-gray-300 hover:bg-gray-700'
                    : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Friends
            </button>
            <button
              onClick={() => setActiveFilter('work')}
              className={`px-3 py-2 text-sm font-medium ${
                activeFilter === 'work'
                  ? darkMode
                    ? 'bg-green-700 text-white'
                    : 'bg-green-600 text-white'
                  : darkMode
                    ? 'text-gray-300 hover:bg-gray-700'
                    : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Work
            </button>
          </div>
          
          {/* Sort Button */}
          <button
            onClick={() => setSortBy(sortBy === 'upcoming' ? 'name' : 'upcoming')}
            className={`ml-2 px-3 py-1 rounded-lg flex items-center ${
              darkMode
                ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            title={sortBy === 'upcoming' ? 'Sorted by upcoming' : 'Sorted by name'}
          >
            <ArrowUpDown size={16} className="mr-1" />
            {sortBy === 'upcoming' ? 'Date' : 'Name'}
          </button>
        </div>
      </div>
      
      {/* Upcoming Birthdays List */}
      <div className={`${
        darkMode ? 'bg-gray-800 border-blue-700' : 'bg-white border-blue-500'
      } rounded-lg shadow-lg p-5 mb-6 border-l-4`}>
        <h2 className={`text-xl font-bold mb-5 flex items-center ${darkMode ? 'text-blue-300' : 'text-blue-800'}`}>
          <Calendar className={`mr-2 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
          {activeFilter === 'all' ? 'All Birthdays' : `${activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)} Birthdays`}
          <span className="ml-2 text-sm bg-opacity-80 px-2 py-1 rounded-full font-normal">
            {filteredBirthdays.length}
          </span>
        </h2>
        
        {birthdays.length === 0 ? (
          <div className={`text-center py-12 ${
            darkMode 
              ? 'bg-gray-700 text-gray-300 border-gray-600' 
              : 'bg-blue-50 text-gray-500 border-blue-200'
          } rounded-lg border-2 border-dashed`}>
            <Calendar className={`mx-auto mb-4 ${darkMode ? 'text-blue-400' : 'text-blue-300'}`} size={64} />
            <p className={`text-lg font-medium ${darkMode ? 'text-blue-300' : 'text-blue-600'}`}>No birthdays added yet</p>
            <p className="text-sm mt-2">Click the "Add Birthday" button to get started!</p>
          </div>
        ) : filteredBirthdays.length === 0 ? (
          <div className={`text-center py-8 ${
            darkMode 
              ? 'bg-gray-700 text-gray-300' 
              : 'bg-blue-50 text-gray-500'
          } rounded-lg border border-dashed ${darkMode ? 'border-gray-600' : 'border-blue-200'}`}>
            <Search className={`mx-auto mb-3 ${darkMode ? 'text-gray-500' : 'text-blue-300'}`} size={40} />
            <p className="text-lg font-medium">No birthdays match your search</p>
            <button 
              onClick={() => {
                setSearchTerm('');
                setActiveFilter('all');
              }}
              className={`mt-3 px-4 py-2 rounded-lg ${
                darkMode
                  ? 'bg-blue-700 text-white hover:bg-blue-600'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBirthdays.map(birthday => (
              <div 
                key={birthday.id} 
                className={`rounded-lg p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center shadow-md hover:shadow-lg transition-all ${
                  getDaysUntil(birthday.date) === "Today!" 
                    ? darkMode
                      ? 'bg-blue-900 border-l-4 border-blue-500'
                      : 'bg-blue-100 border-l-4 border-blue-500'
                    : getDaysUntil(birthday.date) === "Tomorrow!" 
                      ? darkMode
                        ? 'bg-blue-800 border-l-4 border-blue-400'
                        : 'bg-blue-50 border-l-4 border-blue-400'
                      : darkMode
                        ? 'bg-gray-700 border border-gray-600 hover:border-blue-600'
                        : 'bg-white border border-gray-100 hover:border-blue-200'
                }`}
              >
                <div className="flex items-center mb-3 sm:mb-0">
                  <div className={`rounded-full p-2 mr-3 ${
                    getDaysUntil(birthday.date) === "Today!" 
                      ? darkMode
                        ? 'bg-blue-700 text-white'
                        : 'bg-blue-500 text-white'
                      : getDaysUntil(birthday.date) === "Tomorrow!" 
                        ? darkMode
                          ? 'bg-blue-600 text-white'
                          : 'bg-blue-400 text-white'
                        : darkMode
                          ? 'bg-gray-600 text-blue-300'
                          : 'bg-blue-100 text-blue-500'
                  }`}>
                    {getDaysUntil(birthday.date) === "Today!" ? (
                      <Cake size={20} />
                    ) : getDaysUntil(birthday.date) === "Tomorrow!" ? (
                      <Star size={20} />
                    ) : (
                      <Calendar size={20} />
                    )}
                  </div>
                  <div>
                    <h3 className={`font-semibold text-lg ${
                      darkMode ? 'text-gray-100' : 'text-gray-800'
                    }`}>
                      {birthday.name}
                      {calculateAge(birthday.date) && (
                        <span className={`ml-2 text-xs ${
                          darkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          (Turning {calculateAge(birthday.date)})
                        </span>
                      )}
                    </h3>
                    
                    <div className="flex items-center mt-1">
                      <p className={`${
                        darkMode ? 'text-blue-300' : 'text-blue-600'
                      } font-medium mr-3`}>
                        {formatDate(birthday.date)}
                      </p>
                      
                      <span className={`text-xs px-2 py-1 rounded-full 
                        ${darkMode 
                          ? getCategoryColor(birthday.category).darkBg + ' ' + getCategoryColor(birthday.category).darkText
                          : getCategoryColor(birthday.category).bg + ' ' + getCategoryColor(birthday.category).text
                        }`}
                      >
                        {birthday.category || 'friends'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    getDaysUntil(birthday.date) === "Today!" 
                      ? darkMode
                        ? 'bg-blue-600 text-white'
                        : 'bg-blue-600 text-white'
                      : getDaysUntil(birthday.date) === "Tomorrow!" 
                        ? darkMode
                          ? 'bg-blue-500 text-white'
                          : 'bg-blue-500 text-white'
                        : darkMode
                          ? 'bg-gray-600 text-gray-100'
                          : 'bg-blue-100 text-blue-700'
                  }`}>
                    {getDaysUntil(birthday.date)}
                  </span>
                  
                  <div className="space-x-1">
                    <button 
                      onClick={() => startEditing(birthday)}
                      className={`${
                        darkMode
                          ? 'text-blue-400 hover:text-blue-300 bg-gray-600 hover:bg-gray-500'
                          : 'text-blue-500 hover:text-blue-700 bg-blue-50 hover:bg-blue-100'
                      } p-2 rounded-full transition-colors`}
                      title="Edit"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      onClick={() => deleteBirthday(birthday.id)}
                      className={`${
                        darkMode
                          ? 'text-red-400 hover:text-red-300 bg-gray-600 hover:bg-gray-500'
                          : 'text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100'
                      } p-2 rounded-full transition-colors`}
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                      {/* Native “Share…” */}
                    <button
                      onClick={() => shareBirthday(birthday)}
                      className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                      title="Share…"
                    >
                      <Share2 size={16} />
                    </button>

                    {/* Social-media dropdown */}
                    <div className="relative inline-block">
                      <button
                        onClick={() => toggleShareMenu(birthday.id)}
                        className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                        title="Share on social"
                      >
                        <ChevronDown size={16} />
                      </button>
                      {openMenuId === birthday.id && (
                        <div className="absolute right-0 mt-1 bg-white border rounded shadow-lg z-10">
                          <a
                            href={socialShareUrls(birthday).twitter}
                            target="_blank" rel="noopener"
                            className="block px-3 py-1 hover:bg-gray-100"
                          >
                            Twitter
                          </a>
                          <a
                            href={socialShareUrls(birthday).facebook}
                            target="_blank" rel="noopener"
                            className="block px-3 py-1 hover:bg-gray-100"
                          >
                            Facebook
                          </a>
                          <a
                            href={socialShareUrls(birthday).whatsapp}
                            target="_blank" rel="noopener"
                            className="block px-3 py-1 hover:bg-gray-100"
                          >
                            WhatsApp
                          </a>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => setShowBirthdayDetail(birthday.id !== showBirthdayDetail ? birthday.id : null)}
                      className={`${
                        darkMode
                          ? 'text-gray-300 hover:text-white bg-gray-600 hover:bg-gray-500'
                          : 'text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200'
                      } p-2 rounded-full transition-colors`}
                      title="Show details"
                    >
                      {showBirthdayDetail === birthday.id ? <ChevronDown size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>
                </div>
                
                {/* Expanded Details */}
                {showBirthdayDetail === birthday.id && (
                  <div className={`mt-4 pt-3 border-t ${
                    darkMode ? 'border-gray-600' : 'border-gray-200'
                  } grid grid-cols-1 sm:grid-cols-2 gap-4`}>
                    {birthday.notes && (
                      <div>
                        <h4 className={`text-sm font-medium mb-1 ${
                          darkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>Notes:</h4>
                        <p className={`${
                          darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-50 text-gray-700'
                        } p-2 rounded`}>
                          {birthday.notes}
                        </p>
                      </div>
                    )}
                    
                    {birthday.giftIdeas && (
                      <div>
                        <h4 className={`text-sm font-medium mb-1 flex items-center ${
                          darkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          <Gift size={14} className="mr-1" /> Gift Ideas:
                        </h4>
                        <p className={`${
                          darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-50 text-gray-700'
                        } p-2 rounded`}>
                          {birthday.giftIdeas}
                        </p>
                      </div>
                    )}
                    
                    <div>
                      <h4 className={`text-sm font-medium mb-1 flex items-center ${
                        darkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        <Bell size={14} className="mr-1" /> Reminder:
                      </h4>
                      <p className={`${
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {birthday.reminder === '1' 
                          ? '1 day before' 
                          : birthday.reminder === '3' 
                            ? '3 days before' 
                            : birthday.reminder === '7' 
                              ? '1 week before' 
                              : birthday.reminder === '14' 
                                ? '2 weeks before' 
                                : '1 month before'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* App Info Footer */}
      <footer className="mt-auto text-center py-6 text-sm">
        <div className={`${
          darkMode 
            ? 'bg-blue-900 text-white' 
            : 'bg-blue-800 text-white'
        } rounded-lg shadow-lg p-4 max-w-lg mx-auto`}>
          <div className="flex items-center justify-center mb-2">
            <Heart size={16} className="text-pink-400 mr-1" />
            <h3 className="font-medium">Birthday Buddy</h3>
            <Heart size={16} className="text-pink-400 ml-1" />
          </div>
          <p>Never forget a special day again!</p>
          <p className={`mt-2 ${darkMode ? 'text-blue-300' : 'text-blue-200'} text-xs`}>
            All your data is stored securely on your device
          </p>
        </div>
      </footer>
    </div>
  );
}