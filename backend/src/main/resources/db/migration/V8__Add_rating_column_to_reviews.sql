-- Add rating column to reviews table
ALTER TABLE reviews 
ADD COLUMN rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5);

-- Update existing reviews to have default rating of 5
UPDATE reviews SET rating = 5 WHERE rating IS NULL;

-- Make rating column NOT NULL
ALTER TABLE reviews ALTER COLUMN rating SET NOT NULL;
