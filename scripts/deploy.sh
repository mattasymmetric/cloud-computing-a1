#!/bin/bash

# Sync all public static files to public bucket, remove old files not present in dist.
aws s3 sync build/dist $PUBLIC_BUCKET_SERVICE_URL --delete

# Update ServeReactFrontend with ServeReactHandler Package.
# Note: This is the assuming that the handler has been correctly set to match the output file name and function signature using aws lambda update-function-configuration --handler first. 
CWD=$(pwd)
ZIP_DIR="$FRONTEND_PACKAGE_DIR_PREFIX${CWD}/$FRONTEND_PACKAGE"
aws lambda update-function-code --function-name $FRONTEND_LAMBDA_ARN --zip-file $ZIP_DIR