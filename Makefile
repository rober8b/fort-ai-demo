.PHONY: install agent frontend

install:
	cd agent && pip install -r requirements.txt
	cd frontend && npm install

agent:
	cd agent && python agent.py dev

frontend:
	cd frontend && npm run dev
