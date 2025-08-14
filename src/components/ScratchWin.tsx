
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Gift, Phone, Receipt } from 'lucide-react';
import ScratchCard from './ScratchCard';

interface FormData {
  phone: string;
  invoice: string;
}

const ScratchWin = () => {
  const [formData, setFormData] = useState<FormData>({ phone: '', invoice: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | 'warning' | 'better-luck'>('error');
  const [showScratch, setShowScratch] = useState(false);
  const [gift, setGift] = useState('');

  const giftImages = {
    "Payasam mix": "🥣",
"Glass or mug": "☕",
"Snack box": "🍿",
"Tiffin box": "🍱",
"Jug": "🫖",
    "Better luck next time": "🍀"
  };

  const scriptURL = "https://script.google.com/macros/s/AKfycbxYMJpkHqRhgMDMbY6ILkIlngnRzORBFciCETx5W0rHX99IOIGFzTGGY2rz5Mffdww2/exec";

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (message) {
      setMessage('');
    }
  };

  const validateForm = (): boolean => {
    if (!formData.phone.trim()) {
      setMessage('Please enter your phone number');
      setMessageType('error');
      return false;
    }
    
    if (!formData.invoice.trim()) {
      setMessage('Please enter your invoice number');
      setMessageType('error');
      return false;
    }

    // Basic phone number validation (adjust regex as needed)
    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(formData.phone.replace(/\s+/g, ''))) {
      setMessage('Please enter a valid phone number');
      setMessageType('error');
      return false;
    }

    return true;
  };

  const submitForm = async () => {
    console.log('Form submission started');
    if (!validateForm()) return;

    setIsLoading(true);
    setMessage('');
    setShowScratch(false);
    setGift('');

    try {
      console.log('Sending request to server...');
      const response = await fetch(scriptURL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `phone=${encodeURIComponent(formData.phone)}&invoice=${encodeURIComponent(formData.invoice)}`
      });

      const gift = await response.text();
      console.log('Server response:', gift);

      if (gift === "duplicate") {
        console.log('Duplicate invoice detected');
        setMessage("⚠️ This invoice has already been used!");
        setMessageType('warning');
        setShowScratch(false);
      } else if (gift === "invalid") {
        console.log('Invalid submission detected');
        setMessage("❌ Invalid submission. Please check your details and try again.");
        setMessageType('error');
        setShowScratch(false);
      } else if (gift === "error") {
        console.log('Server error detected');
        setMessage("❌ Server error. Please try again later.");
        setMessageType('error');
        setShowScratch(false);
      } else if (gift === "Better luck next time") {
        console.log('Better luck next time case');
        setMessage("😔 Oh no — better luck next time! Scratch to see.");
        setMessageType('better-luck');
        setGift(gift);
        setShowScratch(true);
      } else {
        console.log('Success! Gift received:', gift);
        setMessage("🎉 Success! Scratch the card below to reveal your gift!");
        setMessageType('success');
        setGift(gift);
        setShowScratch(true);
        console.log('Scratch card should now be visible. showScratch:', true, 'gift:', gift);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("❌ Something went wrong. Please check your connection and try again.");
      setMessageType('error');
      setShowScratch(false);
    } finally {
      setIsLoading(false);
      console.log('Form submission completed');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      submitForm();
    }
  };

  console.log('Component render - showScratch:', showScratch, 'gift:', gift, 'message:', message);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 p-4">
      <div className="max-w-md mx-auto pt-8">
        <Card className="shadow-2xl border-0 backdrop-blur-sm bg-white/95">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-bold text-gray-800 flex items-center justify-center gap-2">
              <Gift className="h-6 w-6 text-purple-600" />
              Scratch & Win Offer
            </CardTitle>
            <p className="text-gray-600 mt-2">Enter your details to claim your prize!</p>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="tel"
                  placeholder="Phone number"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pl-10"
                  disabled={isLoading}
                />
              </div>
              
              <div className="relative">
                <Receipt className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Invoice number"
                  value={formData.invoice}
                  onChange={(e) => handleInputChange('invoice', e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pl-10"
                  disabled={isLoading}
                />
              </div>
            </div>

            <Button 
              onClick={submitForm} 
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit'
              )}
            </Button>

            {message && (
              <Alert className={`border-0 ${
                messageType === 'success' ? 'bg-green-50 text-green-800' :
                messageType === 'warning' ? 'bg-yellow-50 text-yellow-800' :
                messageType === 'better-luck' ? 'bg-orange-50 text-orange-800' :
                'bg-red-50 text-red-800'
              }`}>
                <AlertDescription className="text-center font-medium">
                  {message}
                </AlertDescription>
              </Alert>
            )}

            {showScratch && gift && (
              <div className="mt-6">
                <ScratchCard 
                  gift={gift} 
                  giftIcon={giftImages[gift] || giftImages["Better luck next time"]}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ScratchWin;
