# Skincare Group Project
by Alma Ordaz, John Miller, Zak Abdilahi, Nicole Gorrell

**Build Infrastructure**

You need to have the following installed:
*   node.js
*   FastApi
*   Python
*   Pytorch
*   Pillow


**Running the Code**
    
First run the backend in one terminal by:

```
    $ cd .\backend\
    $ uvicorn main:app --host 0.0.0.0 --port 5000 --reload
```

    Then in a seperate terminal, install the required dependencies, generate the frontend code coverage and build validation reports then run the frontend:

```
    $ cd .\skincareApp\
    $ npm install
    $ npm run test:coverage
    $ npx expo-doctor@latest
    $ npx expo start
```

    If you need to fix dependency issues after running the build validation, run:

```
    $ npx expo install --fix
```