import React, { useEffect } from 'react';
import { useStyles } from './styles';
import { ReactComponent as AvatarPicture } from '../../../../assets/img/avatar-picture.svg';
import {
  Autocomplete,
  CircularProgress,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
} from '@mui/material';
import { ReactComponent as NewTrash } from '../../../../assets/img/new-trash.svg';

interface InputFieldI {
  isHistory: boolean;
  loading: boolean;
  setLoading: any;
  sendMessage: (message: string) => void;
}

const InputField = ({ isHistory, loading, setLoading, sendMessage }: InputFieldI) => {
  const { classes } = useStyles();
  const [loadingAutocomplete, setLoadingAutocomplete] = React.useState(false);

  const [inputValue, setInputValue] = React.useState('');
  const [options, setOptions] = React.useState<string[]>([]);
  const abortControllerRef = React.useRef<AbortController | null>(null);

  const handleSearch = (query: string) => {
    if (query.length < 3) {
      setOptions([]);
      return;
    }
    setLoadingAutocomplete(true);

    abortControllerRef.current = new AbortController();

    setTimeout(() => {
      if (abortControllerRef.current?.signal.aborted) return;

      const simulated = [
        'service',
        'service in Illinois',
        'service industry',
        'service in Glenview il',
        'service in Chicago',
        'services',
        'server',
      ].filter(opt => opt.toLowerCase().includes(query.toLowerCase()));

      setOptions(simulated);
      setLoadingAutocomplete(false);
    }, 3000);
  };

  const handleStop = () => {
    abortControllerRef.current?.abort();
    setLoading(false);
  };

  const handleClear = () => {
    setInputValue('');
    setOptions([]);
  };

  useEffect(() => {
    const timeout = setTimeout(() => handleSearch(inputValue), 500);
    return () => clearTimeout(timeout);
  }, [inputValue]);

  return (
    <div className={classes.wrapper}>
      {isHistory && <AvatarPicture className={classes.iconProfile} />}
      <Stack direction="row" spacing={1} alignItems="center" sx={{ width: '100%' }}>
        <Autocomplete
          sx={{ width: '100%' }}
          freeSolo
          disabled={loading}
          options={options}
          inputValue={inputValue}
          onInputChange={(_, newValue) => setInputValue(newValue)}
          onKeyPress={e => e.key === 'Enter' && sendMessage(inputValue)}
          loading={loadingAutocomplete}
          renderInput={params => (
            <TextField
              {...params}
              label=""
              placeholder='"Start by asking ‘How many appointments are scheduled for today?‘"'
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <InputAdornment position="end">
                    {loading && (
                      <>
                        <CircularProgress color="inherit" size={20} sx={{ mr: 1 }} />
                        <p className={classes.stopElement} onClick={handleStop}>
                          STOP
                        </p>
                      </>
                    )}
                  </InputAdornment>
                ),
              }}
              sx={{
                width: '100%',
                '& .MuiOutlinedInput-root': {
                  height: 40,
                  padding: '0 10px',
                },
                '& input': {
                  padding: '4px 10px',
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#ccc',
                  border: 0,
                },
                '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#ccc',
                  border: 0,
                },
                '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#ccc',
                },
              }}
            />
          )}
        />
        {inputValue && (
          <IconButton onClick={handleClear} size="small" aria-label="Clear input">
            <NewTrash />
          </IconButton>
        )}
      </Stack>
    </div>
  );
};

export default InputField;
