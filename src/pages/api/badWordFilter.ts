import axios, { AxiosResponse } from 'axios';

type FilterBadWordsSuccessResponse = {
  'is-bad': boolean;
  'bad-words-total': number;
  'bad-words-list': string[];
  'censored-content': string;
};

type FilterBadWordsErrorResponse = {
  error: string;
  details: any;
};

type FilterBadWordsResponse = FilterBadWordsSuccessResponse | FilterBadWordsErrorResponse;

const filterBadWords = async (content: string): Promise<FilterBadWordsResponse> => {
  const encodedParams = new URLSearchParams();
  encodedParams.set('content', content);
  encodedParams.set('censor-character', '*');

  const options: any = {
    method: 'POST',
    url: 'https://neutrinoapi-bad-word-filter.p.rapidapi.com/bad-word-filter',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'X-RapidAPI-Key': '5266f30be0msh8271980845ce3f4p1783a7jsn7c78b1d9ffef',
      'X-RapidAPI-Host': 'neutrinoapi-bad-word-filter.p.rapidapi.com',
    },
    data: encodedParams,
  };

  try {
    const response: AxiosResponse<FilterBadWordsSuccessResponse> = await axios.request<FilterBadWordsSuccessResponse>(options);

    // Log the response data
    console.log(response.data);

    // Construct and return the success response object
    return {
      'is-bad': response.data['is-bad'],
      'bad-words-total': response.data['bad-words-total'],
      'bad-words-list': response.data['bad-words-list'],
      'censored-content': response.data['censored-content'],
    };
  } catch (error: any) {
    // Log the error details
    console.error(error);

    // Construct and return the error response object
    return { error: 'API request failed', details: error.response.data };
  }
};

export { filterBadWords };
