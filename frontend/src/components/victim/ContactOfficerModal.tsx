import { useState } from 'react';
import { X, Send, AlertCircle, CheckCircle, Phone, Mail } from 'lucide-react';

interface ContactOfficerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    subject: string;
    message: string;
    priority: 'low' | 'medium' | 'high';
    contact_method: 'email' | 'phone' | 'sms';
  }) => Promise<void>;
  officerName: string;
  officerPhone?: string;
  officerEmail?: string;
  isDarkMode: boolean;
}

export function ContactOfficerModal({
  isOpen,
  onClose,
  onSubmit,
  officerName,
  officerPhone,
  officerEmail,
  isDarkMode
}: ContactOfficerModalProps) {
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    contact_method: 'email' as 'email' | 'phone' | 'sms'
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.subject.trim() || !formData.message.trim()) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await onSubmit(formData);
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setFormData({
          subject: '',
          message: '',
          priority: 'medium',
          contact_method: 'email'
        });
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return isDarkMode ? 'border-red-500 bg-red-50 dark:bg-red-900/30' : 'border-red-300';
      case 'low':
        return isDarkMode ? 'border-green-500 bg-green-50 dark:bg-green-900/30' : 'border-green-300';
      default:
        return isDarkMode ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/30' : 'border-yellow-300';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`rounded-xl shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${
          isDarkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <h2 className={isDarkMode ? 'text-white' : 'text-gray-900'}>Contact Investigating Officer</h2>
          <button
            onClick={onClose}
            className={`p-1 rounded transition-colors ${
              isDarkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100'
            }`}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Officer Info */}
        <div className={`p-6 border-b ${isDarkMode ? 'border-gray-700 bg-gray-700/50' : 'border-gray-200 bg-gray-50'}`}>
          <p className={`text-sm mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Assigned Officer</p>
          <p className={`font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{officerName}</p>
          
          <div className="space-y-2 text-sm">
            {officerPhone && (
              <a href={`tel:${officerPhone}`} className={`flex items-center gap-2 ${
                isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
              }`}>
                <Phone className="h-4 w-4" />
                {officerPhone}
              </a>
            )}
            {officerEmail && (
              <a href={`mailto:${officerEmail}`} className={`flex items-center gap-2 ${
                isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
              }`}>
                <Mail className="h-4 w-4" />
                {officerEmail}
              </a>
            )}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {success && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-green-100 text-green-700">
              <CheckCircle className="h-5 w-5 flex-shrink-0" />
              <span>Message sent successfully!</span>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-100 text-red-700">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Subject */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Subject
            </label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              placeholder="e.g., Case update request"
              className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500'
              } focus:outline-none`}
            />
          </div>

          {/* Message */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Message
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Describe your message..."
              rows={4}
              className={`w-full px-3 py-2 rounded-lg border transition-colors resize-none ${
                isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500'
              } focus:outline-none`}
            />
          </div>

          {/* Priority */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Priority
            </label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
              className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white focus:ring-2 focus:ring-blue-500'
                  : 'bg-white border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500'
              } focus:outline-none`}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          {/* Contact Method */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Preferred Contact Method
            </label>
            <select
              value={formData.contact_method}
              onChange={(e) => setFormData({ ...formData, contact_method: e.target.value as any })}
              className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white focus:ring-2 focus:ring-blue-500'
                  : 'bg-white border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500'
              } focus:outline-none`}
            >
              <option value="email">Email</option>
              <option value="phone">Phone Call</option>
              <option value="sms">SMS</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              loading || success
                ? 'opacity-50 cursor-not-allowed'
                : isDarkMode
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {loading ? (
              <>
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Sending...</span>
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                <span>Send Message</span>
              </>
            )}
          </button>

          <p className={`text-xs text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Your message will be delivered to the investigating officer
          </p>
        </form>
      </div>
    </div>
  );
}
