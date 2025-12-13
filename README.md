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

    ```bash
    $ cd .\backend\
    $ uvicorn main:app --host 0.0.0.0 --port 5000 --reload
    ```

    Then in a seperate terminal, run the frontend:

    ```bash
    $ cd .\skincareApp\
    $ npm install
    $ npx expo start
    ```