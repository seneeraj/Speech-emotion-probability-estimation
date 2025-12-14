# Speech-emotion-probability-estimation
“The system performs real-time frame-level speech emotion probability estimation using MFCC features and a neural network model.”

“Emotion recognition models operate on short acoustic frames and produce probabilistic outputs. 
Human emotional state emerges over longer temporal windows, so frame-level predictions must be aggregated and filtered 
using silence detection and temporal smoothing to obtain meaningful emotion estimates.”

Collect predictions over time
Example (2–5 seconds):

| Time | Happy | Sad  | Calm | Angry |
| ---- | ----- | ---- | ---- | ----- |
| t1   | 0.45  | 0.25 | 0.28 | 0.02  |
| t2   | 0.48  | 0.22 | 0.27 | 0.03  |
| t3   | 0.50  | 0.20 | 0.26 | 0.04  |

Aggregate (average / majority)
Happy ≈ 0.48
Sad ≈ 0.22
Calm ≈ 0.27
Angry ≈ 0.03

Final decision:  
Dominant emotion = Happy
This matches human intuition.
