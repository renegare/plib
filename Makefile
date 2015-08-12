VERSION=$(shell git rev-parse --short HEAD)

#!! PROD START
help:			## list available tasks
	@echo "\n\
	   _ _ _\n\
	  | (_) |\n\
	 _ __ | |_| |__\n\
	| '_ \| | | '_ \\ \n\
	| |_) | | | |_) |\n\
	| .__/|_|_|_.__/\n\
	| |\n\
	|_|\n\
	\n\
	Available tasks:\n"
	@fgrep -h "##" $(MAKEFILE_LIST) | fgrep -v fgrep | sed -e 's/\\$$//' | sed -e 's/##//';
	@echo

test:			## run tests
	./node_modules/.bin/mocha tests
