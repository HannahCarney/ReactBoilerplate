#!/bin/bash

ENVIRONMENT=$1

usage="Usage: $(basename "$0") environment"

if [ $# -ne 1 ]; then
    echo $usage
    exit 1
fi

# set up your environment specific variables here
case $ENVIRONMENT in
    development)
        S3_BUCKET="projectname.development"
        PUBLIC_URL_PREFIX="https://development.projectname.com"
        ;;
    
    production)
        S3_BUCKET="projectname.production"
        PUBLIC_URL_PREFIX="https://www.projectname.com"
        ;;
    
    *)
        echo "Error: Unknown environment $ENVIRONMENT"
        exit 1
esac

check_commit_is_tag() {
    TAG_NAME="$(git describe --tags)"

    if [ $? -ne 0 ]; then
        echo "Error: Cannot deploy a commit that is not also a tag"
        exit 1
    fi

    echo "Deploying tag $TAG_NAME"
}

create_cloudfront_invalidation() {
    aws configure set preview.cloudfront true
    aws cloudfront create-invalidation --distribution-id $AWS_CLOUDFRONT_PRODUCTION_DISTRIBUTION_ID --paths /index.html
}

rollbar_deploy_notify() {
    curl https://api.rollbar.com/api/1/deploy/ \
        -F access_token=$ROLLBAR_ACCESS_TOKEN \
        -F revision=$BITBUCKET_COMMIT \
        -F environment=$ENVIRONMENT
    
    for JS_FILE in ./dist/*.js; do
        FILENAME=$(basename $JS_FILE)

        curl https://api.rollbar.com/api/1/sourcemap \
            -F access_token=$ROLLBAR_ACCESS_TOKEN \
            -F version=$BITBUCKET_COMMIT \
            -F minified_url=$PUBLIC_URL_PREFIX/$FILENAME \
            -F source_map=@dist/$FILENAME.map
    done
}

echo "Attempting deployment to $ENVIRONMENT"

if [ $ENVIRONMENT = "production" ]; then
    check_commit_is_tag
fi

aws s3 sync --delete dist s3://$S3_BUCKET

if [ $ENVIRONMENT = "production" ]; then
    create_cloudfront_invalidation
fi

rollbar_deploy_notify