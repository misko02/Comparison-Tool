export type TimeSeriesEntry = {
        x: string;
        y: number;
    };


export type TimeSeriesResponse = Record<string, TimeSeriesEntry[]>;


export const fetchTimeSeriesData = async (): Promise<TimeSeriesResponse> => {
  const resp = await fetch("/timeseries");
  if (!resp.ok) throw new Error(await resp.text());
  const json: Record<string, Array<{ log_date: string; values: number[] }>> = await resp.json(); // TO CHANGE - we need to know the structure of the response

  const out: TimeSeriesResponse = {};
  for (const [key, arr] of Object.entries(json)) {
    if (!Array.isArray(arr)) continue;
    out[key] = arr
      .map(item => ({ x: item.log_date, y: item.values[0] }));
  }
  return out;
};

export const fetchRawTimeSeriesData = async (): Promise<Record<string, any[]>> => {
  const resp = await fetch("/timeseries");
  if (!resp.ok) throw new Error(await resp.text());

  const rawJson = await resp.json();
  return rawJson;
};