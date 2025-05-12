

// src/services/api.js
import { supabase } from '../supabaseClient';

export const urlService = {
  shortenUrl: async (originalUrl, customCode = '') => {
    try {
      // Get the current session from Supabase
      const { data, error } = await supabase.auth.getSession();

      console.log('Session data:', data); // Check what this logs

      if (error || !data.session) {
        console.error('Auth error:', error);
        throw new Error('Not authenticated');
      }

      const token = data.session.access_token;
      console.log('Token exists:', !!token); // Check if token exists

      // Log request details for debugging
      console.log('Sending request to:', 'http://localhost:8000/api/shorten/');
      console.log('Request body:', JSON.stringify({
        original_url: originalUrl,
        custom_code: customCode
      }));
      console.log('Authorization header:', `Bearer ${token.substring(0, 10)}...`);

      // Make the request with explicit headers
      const response = await fetch('http://localhost:8000/api/shorten/', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          original_url: originalUrl,
          custom_code: customCode
        })
      });

      console.log('Raw response:', await response.text()); // Log the raw response

      // Need to make a second request since we consumed the response body above
      const responseJson = await fetch('http://localhost:8000/api/shorten/', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          original_url: originalUrl,
          custom_code: customCode
        })
      }).then(res => res.json());

      console.log('Parsed response:', responseJson);

      if (!response.ok) {
        throw new Error(responseJson.detail || responseJson.error || 'Failed to shorten URL');
      }

      return responseJson;
    } catch (error) {
      console.error('Error in shortenUrl:', error);
      throw error;
    }
  }
};