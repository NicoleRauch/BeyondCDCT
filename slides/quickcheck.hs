-- import Data.Char
import Test.QuickCheck
 
-- instance Arbitrary Char where
--    arbitrary     = choose ('\32', '\128')
--    coarbitrary c = variant (ord c `rem` 4)

prop_RevRev :: [Int] -> Bool
prop_RevRev xs = reverse (reverse xs) == xs

prop_RevId :: [Int] -> Bool
prop_RevId xs = reverse xs == xs

-- In GHCi:
-- quickCheck prop_RevRev
-- quickCheck prop_RevId
