import {useState, useEffect, useCallback} from 'react';
import {useSelector} from 'react-redux';
import {RootState} from 'redux/store';
import {useToast} from 'components/toast/toast-context';
import {
  matchService,
  Match,
  MatchPlayer,
} from '../../services/api/matchService';
import {ImageData} from '../../components/shared/media/ImageUploader';

interface UseMatchDetailOptions {
  /**
   * Whether to use cache for data fetching
   */
  useCache?: boolean;

  /**
   * Whether to fetch data automatically on mount
   */
  autoFetch?: boolean;
}

/**
 * Custom hook to fetch and handle a single match
 *
 * @param route Route object containing match ID
 * @param options Hook options
 */
export const useMatchDetail = (
  route: any,
  options: UseMatchDetailOptions = {useCache: true, autoFetch: true},
) => {
  const matchId = route?.params?._id;

  const [match, setMatch] = useState<Match | null>(null);
  const [isLoading, setIsLoading] = useState(!!matchId && options.autoFetch);
  const [error, setError] = useState<string | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [playerMatchStarting, setPlayerMatchStarting] = useState<MatchPlayer[]>(
    [],
  );
  const [substitution, setSubstitution] = useState<MatchPlayer[]>([]);

  const token = useSelector((state: RootState) => state.login.accessToken);
  const toast = useToast();

  const fetchMatch = useCallback(
    async (forceRefresh: boolean = false) => {
      if (!matchId || !token) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // If forceRefresh is true, bypass cache
        const useCache = options.useCache && !forceRefresh;
        const data = await matchService.getMatchById(matchId, token, useCache);
        setMatch(data);

        // Separate players into starting and substitutes
        if (data.players && data.players.length > 0) {
          const starting = data.players.filter(player => player.starting);
          const subs = data.players.filter(player => !player.starting);
          setPlayerMatchStarting(starting);
          setSubstitution(subs);
        }
      } catch (err) {
        console.error('Error fetching match:', err);
        setError('Failed to load match details');
        toast.show({
          message: 'Failed to load match details',
          preset: 'error',
        });
      } finally {
        setIsLoading(false);
      }
    },
    [matchId, token, options.useCache, toast],
  );

  const uploadImage = useCallback(
    async (image: ImageData) => {
      if (!matchId || !token || !match) {
        return null;
      }

      try {
        const result = await matchService.uploadMatchImage(
          matchId,
          image,
          token,
        );
        // Refresh the match to include the new image
        fetchMatch();
        return result.url;
      } catch (err) {
        console.error('Error uploading image:', err);
        toast.show({
          message: 'Failed to upload image',
          preset: 'error',
        });
        return null;
      }
    },
    [matchId, token, match, fetchMatch, toast],
  );

  // Fetch data on mount if autoFetch is true
  useEffect(() => {
    if (options.autoFetch && matchId) {
      fetchMatch();
    }
  }, [matchId, options.autoFetch, fetchMatch]);

  return {
    match,
    isLoading,
    error,
    activeSlide,
    setActiveSlide,
    playerMatchStarting,
    substitution,
    fetchMatch,
    uploadImage,
  };
};
