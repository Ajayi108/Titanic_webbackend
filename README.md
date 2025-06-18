Install requirements: `pip install -r requirements.txt` 
Run on the terminal :  `uvicorn main:app --reload --port 5000`

$env:AUTHJWT_SECRET_KEY = "SUPER_SECRET_KEY"
echo $env:AUTHJWT_SECRET_KEY
export AUTHJWT_SECRET_KEY="SUPER_SECRET_KEY"