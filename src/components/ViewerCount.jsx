import { useState, useEffect } from 'react';
import { ref, runTransaction, onValue } from 'firebase/database';
import { database } from '../firebase';
import { FaEye } from 'react-icons/fa';

const VIEW_COUNT_KEY = 'portfolio_view_counted';

export default function ViewerCount() {
  const [viewCount, setViewCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showCounter, setShowCounter] = useState(false);

  useEffect(() => {
    // Check if this page load has already counted a view
    const hasCounted = sessionStorage.getItem(VIEW_COUNT_KEY);
    
    const viewsRef = ref(database, 'views');

    // Function to increment view count using transaction
    const incrementViewCount = async () => {
      try {
        await runTransaction(viewsRef, (currentViews) => {
          // If no views yet, start at 1, otherwise increment
          if (currentViews === null) {
            return 1;
          }
          return (currentViews || 0) + 1;
        });
        
        // Mark this session as counted
        sessionStorage.setItem(VIEW_COUNT_KEY, 'true');
      } catch (err) {
        console.log('Firebase transaction error (database may not be set up yet)');
      }
    };

    // Only increment if this session hasn't counted yet
    if (!hasCounted) {
      incrementViewCount();
    }

    // Listen for real-time updates
    const unsubscribe = onValue(viewsRef, (snapshot) => {
      const views = snapshot.val();
      if (views !== null) {
        setViewCount(views);
        setShowCounter(true);
      }
      setIsLoading(false);
    }, (err) => {
      console.log('Firebase read error:', err.message);
      // Show counter anyway for demo purposes
      setShowCounter(true);
      setIsLoading(false);
    });

    // Cleanup subscription on unmount
    return () => {
      unsubscribe();
    };
  }, []);

  // Always render (for demo), show loading or actual count
  return (
    <div className="viewer-count" title={`${viewCount.toLocaleString()} total views`}>
      <FaEye className="viewer-icon" />
      <span className="viewer-number">
        {isLoading ? '---' : viewCount > 0 ? viewCount.toLocaleString() : '0'}
      </span>
    </div>
  );
}

