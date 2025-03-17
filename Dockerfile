# Official Python image for Docker
FROM python:3.10

WORKDIR /app

# Copy only requirements file first (for better caching)
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application files
COPY . .

# Expose the port Flask will run on
EXPOSE 5000

# Run application
CMD ["python", "app.py"]